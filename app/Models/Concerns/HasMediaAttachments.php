<?php

namespace App\Models\Concerns;

use App\Models\Media\MediaAttachment;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasMediaAttachments
{
    public function mediaAttachments(): MorphMany
    {
        return $this->morphMany(MediaAttachment::class, 'attachable')->latest();
    }

    public function mediaCollection(string $collection = 'attachments'): MorphMany
    {
        return $this->mediaAttachments()->where('collection', $collection);
    }

    public function mediaForFrontend(string $collection = 'attachments'): array
    {
        return $this->mediaCollection($collection)
            ->get()
            ->filter(fn ($media) => $media instanceof MediaAttachment)
            ->map(fn ($media) => $media->toUploadArray())
            ->all();
    }
}
