<?php

namespace App\Services\Upload;

use App\Models\Media\MediaAttachment;
use App\Models\Media\TemporaryUpload;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UploadManager
{
    public function __construct(
        private readonly FileNameGenerator $fileNameGenerator,
        private readonly ImageOptimizer $imageOptimizer,
    ) {}

    public function uploadForModel(
        Model $model,
        UploadedFile $file,
        string $categoryKey,
        string $collection = 'attachments',
        ?int $userId = null,
    ): MediaAttachment {
        $category = UploadCategory::fromKey($categoryKey);
        $this->validateFile($file, $category);

        $payload = $this->storeUploadedFile($file, $category, $collection);

        return $this->createMediaAttachment([
            'attachable_type' => $model->getMorphClass(),
            'attachable_id' => $model->getKey(),
            'user_id' => $userId,
            ...$payload,
        ]);
    }

    public function uploadTemporary(UploadedFile $file, string $categoryKey, string $collection = 'attachments', ?int $userId = null): TemporaryUpload
    {
        $category = UploadCategory::fromKey($categoryKey);
        $this->validateFile($file, $category);

        $temporaryUpload = new TemporaryUpload;
        $temporaryUpload->forceFill([
            'user_id' => $userId,
            ...$this->storeUploadedFile($file, $category, $collection, 'tmp'),
            'expires_at' => now()->addMinutes((int) config('upload.temporary_upload_ttl_minutes', 120)),
        ]);
        $temporaryUpload->save();

        return $temporaryUpload;
    }

    public function attachTemporaryUploads(Model $model, array $temporaryUploadIds, string $collection = 'attachments', ?int $userId = null): array
    {
        if ($temporaryUploadIds === []) {
            return [];
        }

        $query = TemporaryUpload::query()
            ->whereIn('id', $temporaryUploadIds)
            ->where('expires_at', '>', now());

        if ($userId !== null) {
            $query->where('user_id', $userId);
        }

        return $query->get()->map(function (TemporaryUpload $temporaryUpload) use ($model, $collection) {
            $media = $this->createMediaAttachment([
                'attachable_type' => $model->getMorphClass(),
                'attachable_id' => $model->getKey(),
                'user_id' => $temporaryUpload->user_id,
                'category' => $temporaryUpload->category,
                'collection' => $collection,
                'disk' => $temporaryUpload->disk,
                'visibility' => $temporaryUpload->visibility,
                'path' => $temporaryUpload->path,
                'optimized_path' => $temporaryUpload->optimized_path,
                'original_name' => $temporaryUpload->original_name,
                'stored_name' => $temporaryUpload->stored_name,
                'extension' => $temporaryUpload->extension,
                'mime_type' => $temporaryUpload->mime_type,
                'size' => $temporaryUpload->size,
                'optimized_size' => $temporaryUpload->optimized_size,
                'checksum' => $temporaryUpload->checksum,
                'is_optimized' => $temporaryUpload->is_optimized,
                'metadata' => $temporaryUpload->metadata,
            ]);

            $temporaryUpload->delete();

            return $media;
        })->all();
    }

    public function uploadManyForModel(Model $model, array $files, string $categoryKey, string $collection = 'attachments', ?int $userId = null): array
    {
        $maxFiles = (int) config('upload.max_files_per_request', 10);

        if (count($files) > $maxFiles) {
            throw ValidationException::withMessages([
                'attachments' => "Maximum {$maxFiles} files are allowed per upload.",
            ]);
        }

        return array_map(
            fn (UploadedFile $file) => $this->uploadForModel($model, $file, $categoryKey, $collection, $userId),
            $files,
        );
    }

    public function delete(MediaAttachment $media): void
    {
        Storage::disk($media->disk)->delete(array_filter([$media->path, $media->optimized_path]));
        $media->delete();
    }

    public function deleteTemporary(TemporaryUpload $temporaryUpload): void
    {
        Storage::disk($temporaryUpload->disk)->delete(array_filter([$temporaryUpload->path, $temporaryUpload->optimized_path]));
        $temporaryUpload->delete();
    }

    public function publicConfig(?array $only = null): array
    {
        return collect(config('upload.categories', []))
            ->filter(fn (array $settings, string $key) => $only === null || in_array($key, $only, true))
            ->filter(fn (array $settings) => filter_var($settings['enabled'] ?? true, FILTER_VALIDATE_BOOLEAN))
            ->map(fn (array $settings, string $key) => [
                'key' => $key,
                'label' => $settings['label'] ?? Str::headline($key),
                'extensions' => $settings['extensions'] ?? [],
                'accept' => collect($settings['extensions'] ?? [])->map(fn (string $extension) => '.'.$extension)->implode(','),
                'max_size_kb' => (int) ($settings['max_size_kb'] ?? 10240),
                'max_files' => (int) config('upload.max_files_per_request', 10),
                'optimize' => (bool) ($settings['optimize'] ?? false),
            ])
            ->values()
            ->all();
    }

    private function validateFile(UploadedFile $file, UploadCategory $category): void
    {
        $validator = Validator::make(['file' => $file], [
            'file' => [
                'required',
                'file',
                'max:'.$category->maxSizeKb(),
                'extensions:'.implode(',', $category->extensions()),
                'mimetypes:'.implode(',', $category->mimes()),
            ],
        ]);

        $validator->validate();
    }

    private function storeUploadedFile(UploadedFile $file, UploadCategory $category, string $collection, ?string $pathPrefix = null): array
    {
        $disk = $category->disk();
        $storedName = $this->fileNameGenerator->generate($file, $category);
        $path = $this->buildPath($category, $collection, $storedName, $pathPrefix);
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension());
        $mimeType = $file->getMimeType();

        Storage::disk($disk)->putFileAs(dirname($path), $file, basename($path));

        $optimizedPath = null;
        $optimizedSize = null;
        $isOptimized = false;

        if ($category->shouldOptimize() && str_starts_with((string) $mimeType, 'image/')) {
            $optimizedPath = $this->optimizedPath($path);
            $sourcePath = Storage::disk($disk)->path($path);
            $targetPath = Storage::disk($disk)->path($optimizedPath);

            if ($this->imageOptimizer->optimize($sourcePath, $targetPath, (string) $mimeType, $category->imageSettings())) {
                $optimizedSize = Storage::disk($disk)->size($optimizedPath);
                $isOptimized = true;
            } else {
                $optimizedPath = null;
            }
        }

        return [
            'category' => $category->key,
            'collection' => $collection,
            'disk' => $disk,
            'visibility' => $category->visibility(),
            'path' => $path,
            'optimized_path' => $optimizedPath,
            'original_name' => $file->getClientOriginalName(),
            'stored_name' => $storedName,
            'extension' => $extension,
            'mime_type' => $mimeType,
            'size' => $file->getSize() ?: Storage::disk($disk)->size($path),
            'optimized_size' => $optimizedSize,
            'checksum' => hash_file('sha256', Storage::disk($disk)->path($path)),
            'is_optimized' => $isOptimized,
            'metadata' => [
                'naming_strategy' => $category->namingStrategy(),
            ],
        ];
    }

    private function buildPath(UploadCategory $category, string $collection, string $storedName, ?string $pathPrefix = null): string
    {
        return collect(array_filter([
            $pathPrefix,
            $category->key,
            $collection,
            now()->format('Y'),
            now()->format('m'),
            now()->format('d'),
            $storedName,
        ]))->implode('/');
    }

    private function createMediaAttachment(array $attributes): MediaAttachment
    {
        $media = new MediaAttachment;
        $media->forceFill($attributes);
        $media->save();

        return $media;
    }

    private function optimizedPath(string $path): string
    {
        $directory = dirname($path);
        $name = pathinfo($path, PATHINFO_FILENAME);
        $extension = pathinfo($path, PATHINFO_EXTENSION);

        return "{$directory}/optimized/{$name}.{$extension}";
    }
}
