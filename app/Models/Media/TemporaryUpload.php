<?php

namespace App\Models\Media;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemporaryUpload extends Model
{
    use HasFactory;

    protected $fillable = [
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
        'expires_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_optimized' => 'boolean',
        'size' => 'integer',
        'optimized_size' => 'integer',
        'expires_at' => 'datetime',
    ];

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
            'expires_at' => $this->expires_at->toISOString(),
        ];
    }
}
