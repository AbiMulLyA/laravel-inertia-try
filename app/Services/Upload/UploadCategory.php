<?php

namespace App\Services\Upload;

use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class UploadCategory
{
    public function __construct(
        public readonly string $key,
        public readonly array $settings,
    ) {}

    public static function fromKey(string $key): self
    {
        $settings = config("upload.categories.{$key}");

        if (! is_array($settings)) {
            throw ValidationException::withMessages([
                'attachments' => "Upload category [{$key}] is not registered.",
            ]);
        }

        if (! filter_var(Arr::get($settings, 'enabled', true), FILTER_VALIDATE_BOOLEAN)) {
            throw ValidationException::withMessages([
                'attachments' => "Upload category [{$key}] is disabled.",
            ]);
        }

        return new self($key, $settings);
    }

    public function extensions(): array
    {
        return Arr::get($this->settings, 'extensions', []);
    }

    public function mimes(): array
    {
        return Arr::get($this->settings, 'mimes', []);
    }

    public function maxSizeKb(): int
    {
        return (int) Arr::get($this->settings, 'max_size_kb', config('upload.max_file_size_kb', 10240));
    }

    public function visibility(): string
    {
        return Arr::get($this->settings, 'visibility', config('upload.default_visibility', 'private'));
    }

    public function disk(): string
    {
        return $this->visibility() === 'public'
            ? config('upload.public_disk', 'uploads_public')
            : config('upload.private_disk', 'uploads_private');
    }

    public function namingStrategy(): string
    {
        return Arr::get($this->settings, 'naming_strategy', config('upload.default_naming_strategy', 'system'));
    }

    public function shouldOptimize(): bool
    {
        return filter_var(Arr::get($this->settings, 'optimize', false), FILTER_VALIDATE_BOOLEAN);
    }

    public function imageSettings(): array
    {
        return Arr::get($this->settings, 'image', []);
    }
}
