<?php

namespace App\Http\Controllers\Media;

use App\Http\Controllers\Controller;
use App\Models\Media\TemporaryUpload;
use App\Services\Upload\UploadManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TemporaryUploadController extends Controller
{
    public function store(Request $request, UploadManager $uploadManager): JsonResponse
    {
        abort_unless($request->user() !== null, 403);

        $validated = $request->validate([
            'file' => ['required', 'file'],
            'category' => ['required', 'string'],
            'collection' => ['nullable', 'string', 'max:80'],
        ]);

        $temporaryUpload = $uploadManager->uploadTemporary(
            $request->file('file'),
            $validated['category'],
            $validated['collection'] ?? 'attachments',
            $request->user()->id,
        );

        return response()->json([
            'data' => $temporaryUpload->toUploadArray(),
        ], 201);
    }

    public function destroy(Request $request, TemporaryUpload $temporaryUpload, UploadManager $uploadManager): JsonResponse
    {
        abort_unless($request->user() && $temporaryUpload->user_id === $request->user()->id, 403);

        $uploadManager->deleteTemporary($temporaryUpload);

        return response()->json([
            'message' => 'Temporary upload deleted.',
        ]);
    }
}
