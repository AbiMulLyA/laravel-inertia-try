<?php

return [
    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [
        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
        ],

        'uploads_private' => [
            'driver' => 'local',
            'root' => env('UPLOAD_PRIVATE_PATH', storage_path('app/uploads/private')),
            'throw' => false,
        ],

        'uploads_public' => [
            'driver' => 'local',
            'root' => env('UPLOAD_PUBLIC_PATH', storage_path('app/uploads/public')),
            'url' => env('APP_URL').'/uploads',
            'visibility' => 'public',
            'throw' => false,
        ],
    ],

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],
];
