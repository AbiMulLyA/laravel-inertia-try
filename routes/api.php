<?php

use App\Http\Controllers\Api\AuthApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Kominfo Laravel Inertia Base - API Routes
| All endpoints use prefix /api/v1
|
*/

Route::prefix('v1')->group(function () {

    // ===========================================
    // Authentication Endpoints
    // ===========================================
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('/auth/login', [AuthApiController::class, 'login']);
        Route::post('/auth/register', [AuthApiController::class, 'register']);
    });

    Route::middleware('auth:api')->group(function () {
        Route::post('/auth/logout', [AuthApiController::class, 'logout']);
        Route::post('/auth/refresh', [AuthApiController::class, 'refresh']);
        Route::get('/auth/user', [AuthApiController::class, 'user']);
    });

    // ===========================================
    // Add your API routes here
    // ===========================================

    // Public Endpoints (Read Only) - Example:
    // Route::get('/categories', [CategoryApiController::class, 'index']);
    // Route::get('/categories/{category}', [CategoryApiController::class, 'show']);

    // Protected Endpoints (Require Authentication) - Example:
    // Route::middleware('auth:api')->group(function () {
    //     Route::post('/categories', [CategoryApiController::class, 'store']);
    //     Route::put('/categories/{category}', [CategoryApiController::class, 'update']);
    //     Route::delete('/categories/{category}', [CategoryApiController::class, 'destroy']);
    // });
});
