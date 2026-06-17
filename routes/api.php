<?php

use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\CategoryApiController;
use App\Http\Controllers\Api\PermissionApiController;
use App\Http\Controllers\Api\ProjectApiController;
use App\Http\Controllers\Api\RoleApiController;
use App\Http\Controllers\Api\TaskApiController;
use App\Http\Controllers\Api\UserApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Kominfo Laravel Inertia Base - API Routes
| All endpoints use prefix /api/v1
| All endpoints (except auth) require Bearer token authentication
|
*/

Route::prefix('v1')->group(function () {

    // ===========================================
    // Authentication Endpoints (Public)
    // ===========================================
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('/auth/login', [AuthApiController::class, 'login']);
        Route::post('/auth/register', [AuthApiController::class, 'register']);
    });

    // ===========================================
    // Authenticated Endpoints
    // All routes below require Bearer token
    // ===========================================
    Route::middleware('auth:api')->group(function () {

        // -----------------------------------------
        // Auth Management
        // -----------------------------------------
        Route::post('/auth/logout', [AuthApiController::class, 'logout']);
        Route::post('/auth/refresh', [AuthApiController::class, 'refresh']);
        Route::get('/auth/user', [AuthApiController::class, 'user']);

        // -----------------------------------------
        // Categories
        // -----------------------------------------
        Route::get('/categories', [CategoryApiController::class, 'index']);
        Route::get('/categories/{category}', [CategoryApiController::class, 'show']);
        Route::post('/categories', [CategoryApiController::class, 'store']);
        Route::put('/categories/{category}', [CategoryApiController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryApiController::class, 'destroy']);

        // -----------------------------------------
        // Projects
        // -----------------------------------------
        Route::get('/projects', [ProjectApiController::class, 'index']);
        Route::get('/projects/summary', [ProjectApiController::class, 'summary']);
        Route::get('/projects/{project}', [ProjectApiController::class, 'show']);
        Route::post('/projects', [ProjectApiController::class, 'store']);
        Route::put('/projects/{project}', [ProjectApiController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectApiController::class, 'destroy']);

        // -----------------------------------------
        // Tasks
        // -----------------------------------------
        Route::get('/tasks', [TaskApiController::class, 'index']);
        Route::get('/tasks/summary', [TaskApiController::class, 'summary']);
        Route::get('/tasks/{task}', [TaskApiController::class, 'show']);
        Route::post('/tasks', [TaskApiController::class, 'store']);
        Route::put('/tasks/{task}', [TaskApiController::class, 'update']);
        Route::patch('/tasks/{task}/progress', [TaskApiController::class, 'updateProgress']);
        Route::delete('/tasks/{task}', [TaskApiController::class, 'destroy']);

        // -----------------------------------------
        // Roles
        // -----------------------------------------
        Route::get('/roles', [RoleApiController::class, 'index']);
        Route::get('/roles/permissions', [RoleApiController::class, 'availablePermissions']);
        Route::get('/roles/{role}', [RoleApiController::class, 'show']);
        Route::post('/roles', [RoleApiController::class, 'store']);
        Route::put('/roles/{role}', [RoleApiController::class, 'update']);
        Route::delete('/roles/{role}', [RoleApiController::class, 'destroy']);

        // -----------------------------------------
        // Permissions
        // -----------------------------------------
        Route::get('/permissions', [PermissionApiController::class, 'index']);
        Route::get('/permissions/groups', [PermissionApiController::class, 'groups']);
        Route::get('/permissions/{permission}', [PermissionApiController::class, 'show']);
        Route::post('/permissions', [PermissionApiController::class, 'store']);
        Route::put('/permissions/{permission}', [PermissionApiController::class, 'update']);
        Route::delete('/permissions/{permission}', [PermissionApiController::class, 'destroy']);

        // -----------------------------------------
        // Users
        // -----------------------------------------
        Route::get('/users', [UserApiController::class, 'index']);
        Route::get('/users/summary', [UserApiController::class, 'summary']);
        Route::get('/users/{user}', [UserApiController::class, 'show']);
        Route::post('/users', [UserApiController::class, 'store']);
        Route::put('/users/{user}', [UserApiController::class, 'update']);
        Route::delete('/users/{user}', [UserApiController::class, 'destroy']);
    });
});
