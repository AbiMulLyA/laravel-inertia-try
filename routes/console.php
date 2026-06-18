<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\Media\TemporaryUpload;
use App\Services\Upload\UploadManager;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('media:clear-temp', function (UploadManager $uploadManager) {
    $count = 0;

    TemporaryUpload::query()
        ->where('expires_at', '<=', now())
        ->each(function (TemporaryUpload $temporaryUpload) use ($uploadManager, &$count) {
            $uploadManager->deleteTemporary($temporaryUpload);
            $count++;
        });

    $this->info("Deleted {$count} expired temporary upload(s).");
})->purpose('Delete expired temporary uploads and their files');
