<?php

use App\Http\Controllers\Api\BidangApiController;
use App\Http\Controllers\Api\ProgramApiController;
use App\Http\Controllers\Api\KegiatanApiController;
use App\Http\Controllers\Api\PelakuUsahaApiController;
use App\Http\Controllers\Api\StatistikApiController;
use App\Http\Controllers\Api\AuthApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| REST API untuk berbagi data Dinas Pertanian dengan aplikasi eksternal.
| Semua endpoint menggunakan prefix /api/v1
|
*/

Route::prefix('v1')->group(function () {

    // ===========================================
    // Authentication Endpoints
    // ===========================================
    Route::post('/auth/login', [AuthApiController::class, 'login']);
    Route::post('/auth/register', [AuthApiController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthApiController::class, 'logout']);
        Route::get('/auth/user', [AuthApiController::class, 'user']);
        Route::post('/auth/tokens', [AuthApiController::class, 'createToken']);
    });

    // ===========================================
    // Public Endpoints (Read Only)
    // ===========================================

    // Statistik Dashboard
    Route::get('/statistik', [StatistikApiController::class, 'index']);
    Route::get('/statistik/bidang', [StatistikApiController::class, 'byBidang']);
    Route::get('/statistik/kecamatan', [StatistikApiController::class, 'byKecamatan']);

    // Bidang - Public Read
    Route::get('/bidang', [BidangApiController::class, 'index']);
    Route::get('/bidang/{bidang}', [BidangApiController::class, 'show']);

    // Program - Public Read
    Route::get('/program', [ProgramApiController::class, 'index']);
    Route::get('/program/{program}', [ProgramApiController::class, 'show']);

    // Kegiatan - Public Read
    Route::get('/kegiatan', [KegiatanApiController::class, 'index']);
    Route::get('/kegiatan/{kegiatan}', [KegiatanApiController::class, 'show']);

    // Pelaku Usaha - Public Read
    Route::get('/pelaku-usaha', [PelakuUsahaApiController::class, 'index']);
    Route::get('/pelaku-usaha/{pelakuUsaha}', [PelakuUsahaApiController::class, 'show']);

    // ===========================================
    // Protected Endpoints (Require Authentication)
    // ===========================================
    Route::middleware('auth:sanctum')->group(function () {

        // Bidang - CRUD
        Route::post('/bidang', [BidangApiController::class, 'store']);
        Route::put('/bidang/{bidang}', [BidangApiController::class, 'update']);
        Route::delete('/bidang/{bidang}', [BidangApiController::class, 'destroy']);

        // Program - CRUD
        Route::post('/program', [ProgramApiController::class, 'store']);
        Route::put('/program/{program}', [ProgramApiController::class, 'update']);
        Route::delete('/program/{program}', [ProgramApiController::class, 'destroy']);

        // Kegiatan - CRUD
        Route::post('/kegiatan', [KegiatanApiController::class, 'store']);
        Route::put('/kegiatan/{kegiatan}', [KegiatanApiController::class, 'update']);
        Route::patch('/kegiatan/{kegiatan}/progress', [KegiatanApiController::class, 'updateProgress']);
        Route::delete('/kegiatan/{kegiatan}', [KegiatanApiController::class, 'destroy']);

        // Pelaku Usaha - CRUD
        Route::post('/pelaku-usaha', [PelakuUsahaApiController::class, 'store']);
        Route::put('/pelaku-usaha/{pelakuUsaha}', [PelakuUsahaApiController::class, 'update']);
        Route::patch('/pelaku-usaha/{pelakuUsaha}/toggle-status', [PelakuUsahaApiController::class, 'toggleStatus']);
        Route::delete('/pelaku-usaha/{pelakuUsaha}', [PelakuUsahaApiController::class, 'destroy']);
    });
});
