<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Octane Server
    |--------------------------------------------------------------------------
    |
    | FrankenPHP is recommended for Laravel 12 due to its performance
    | and native PHP integration.
    |
    */

    'server' => env('OCTANE_SERVER', 'frankenphp'),

    /*
    |--------------------------------------------------------------------------
    | Force HTTPS
    |--------------------------------------------------------------------------
    */

    'https' => env('OCTANE_HTTPS', false),

    /*
    |--------------------------------------------------------------------------
    | Octane Listeners
    |--------------------------------------------------------------------------
    */

    'listeners' => [
        // WorkerStarting::class => [],
        // RequestReceived::class => [],
        // RequestHandled::class => [],
        // RequestTerminated::class => [],
        // TaskReceived::class => [],
        // TickReceived::class => [],
    ],

    /*
    |--------------------------------------------------------------------------
    | Warm / Flush Bindings
    |--------------------------------------------------------------------------
    |
    | Services that should be warmed or flushed between requests.
    |
    */

    'warm' => [
        // Services to resolve on boot
    ],

    'flush' => [
        // Services to flush after each request
    ],

    /*
    |--------------------------------------------------------------------------
    | Octane Cache Table
    |--------------------------------------------------------------------------
    |
    | In-memory cache table size (in rows).
    |
    */

    'cache' => [
        'rows' => 1000,
        'bytes' => 10000,
    ],

    /*
    |--------------------------------------------------------------------------
    | Octane Swoole Tables
    |--------------------------------------------------------------------------
    */

    'tables' => [
        'cache' => [
            'rows' => 1000,
            'columns' => [
                ['name' => 'value', 'type' => 'string', 'size' => 10000],
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | File Watching
    |--------------------------------------------------------------------------
    |
    | Auto-reload on file changes during development.
    |
    */

    'watch' => [
        'app',
        'bootstrap',
        'config',
        'database',
        'public/**/*.php',
        'resources/**/*.php',
        'routes',
        'composer.lock',
        '.env',
    ],

    /*
    |--------------------------------------------------------------------------
    | Garbage Collection
    |--------------------------------------------------------------------------
    |
    | Threshold for triggering garbage collection.
    |
    */

    'garbage' => 50,

    /*
    |--------------------------------------------------------------------------
    | Max Execution Time
    |--------------------------------------------------------------------------
    |
    | Maximum time (in seconds) before a request is terminated.
    | Set to 0 to disable.
    |
    */

    'max_execution_time' => 30,

    /*
    |--------------------------------------------------------------------------
    | State Reset
    |--------------------------------------------------------------------------
    |
    | Reset these service states between requests.
    |
    */

    'state' => [
        // Singletons to reset
    ],
];
