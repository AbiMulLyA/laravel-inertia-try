<?php

namespace App\Services\Upload;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class FileNameGenerator
{
    public function generate(UploadedFile $file, UploadCategory $category): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension());
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeOriginalName = Str::slug($originalName) ?: 'file';
        $unique = (string) Str::uuid();

        return match ($category->namingStrategy()) {
            'original' => "{$safeOriginalName}.{$extension}",
            'original_with_suffix' => "{$safeOriginalName}-{$unique}.{$extension}",
            'hash' => hash_file('sha256', $file->getRealPath()).".{$extension}",
            'date_prefix_original' => now()->format('YmdHis')."-{$safeOriginalName}.{$extension}",
            default => "{$unique}.{$extension}",
        };
    }
}
