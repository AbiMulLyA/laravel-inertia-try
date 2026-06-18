<?php

namespace App\Http\Controllers\Media;

use App\Http\Controllers\Controller;
use App\Models\Media\MediaAttachment;
use App\Services\Upload\UploadManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MediaController extends Controller
{
    public function download(MediaAttachment $media): StreamedResponse
    {
        abort_unless(auth()->check(), 403);

        $path = $media->optimized_path ?: $media->path;

        abort_unless(Storage::disk($media->disk)->exists($path), 404);

        return Storage::disk($media->disk)->download($path, $media->original_name);
    }

    public function destroy(MediaAttachment $media, UploadManager $uploadManager): RedirectResponse
    {
        abort_unless(auth()->check(), 403);

        $uploadManager->delete($media);

        return back()->with('success', 'Attachment deleted successfully.');
    }
}
