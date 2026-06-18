<?php

namespace App\Models\Media;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class MediaAttachment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'attachable_type',
        'attachable_id',
        'user_id',
        'category',
        'collection',
        'disk',
        'visibility',
        'path',
        'optimized_path',
        'original_name',
        'stored_name',
        'extension',
        'mime_type',
        'size',
        'optimized_size',
        'checksum',
        'is_optimized',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_optimized' => 'boolean',
        'size' => 'integer',
        'optimized_size' => 'integer',
    ];

    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    public function getDownloadUrlAttribute(): string
    {
        return route('media.download', $this);
    }

    public function getPreviewUrlAttribute(): ?string
    {
        if ($this->visibility !== 'public') {
            return $this->download_url;
        }

        return Storage::disk($this->disk)->url($this->optimized_path ?: $this->path);
    }

    public function toUploadArray(): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category,
            'collection' => $this->collection,
            'original_name' => $this->original_name,
            'extension' => $this->extension,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'optimized_size' => $this->optimized_size,
            'is_optimized' => $this->is_optimized,
            'download_url' => $this->download_url,
            'preview_url' => $this->preview_url,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
