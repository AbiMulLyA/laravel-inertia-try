<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BidangController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\KegiatanController;
use App\Http\Controllers\PelakuUsahaController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Bidang CRUD
    Route::prefix('bidang')->name('bidang.')->group(function () {
        Route::get('/', [BidangController::class, 'index'])->name('index');
        Route::get('/create', [BidangController::class, 'create'])->name('create');
        Route::post('/', [BidangController::class, 'store'])->name('store');
        Route::get('/{bidang}/edit', [BidangController::class, 'edit'])->name('edit');
        Route::put('/{bidang}', [BidangController::class, 'update'])->name('update');
        Route::delete('/{bidang}', [BidangController::class, 'destroy'])->name('destroy');
    });

    // Program CRUD
    Route::prefix('program')->name('program.')->group(function () {
        Route::get('/', [ProgramController::class, 'index'])->name('index');
        Route::get('/create', [ProgramController::class, 'create'])->name('create');
        Route::post('/', [ProgramController::class, 'store'])->name('store');
        Route::get('/{program}/edit', [ProgramController::class, 'edit'])->name('edit');
        Route::put('/{program}', [ProgramController::class, 'update'])->name('update');
        Route::delete('/{program}', [ProgramController::class, 'destroy'])->name('destroy');
    });

    // Kegiatan CRUD
    Route::prefix('kegiatan')->name('kegiatan.')->group(function () {
        Route::get('/', [KegiatanController::class, 'index'])->name('index');
        Route::get('/create', [KegiatanController::class, 'create'])->name('create');
        Route::post('/', [KegiatanController::class, 'store'])->name('store');
        Route::get('/{kegiatan}', [KegiatanController::class, 'show'])->name('show');
        Route::get('/{kegiatan}/edit', [KegiatanController::class, 'edit'])->name('edit');
        Route::put('/{kegiatan}', [KegiatanController::class, 'update'])->name('update');
        Route::delete('/{kegiatan}', [KegiatanController::class, 'destroy'])->name('destroy');
        Route::patch('/{kegiatan}/progress', [KegiatanController::class, 'updateProgress'])->name('update-progress');
    });

    // Pelaku Usaha CRUD
    Route::prefix('pelaku-usaha')->name('pelaku-usaha.')->group(function () {
        Route::get('/', [PelakuUsahaController::class, 'index'])->name('index');
        Route::get('/create', [PelakuUsahaController::class, 'create'])->name('create');
        Route::post('/', [PelakuUsahaController::class, 'store'])->name('store');
        Route::get('/import', [PelakuUsahaController::class, 'importForm'])->name('import.form');
        Route::post('/import', [PelakuUsahaController::class, 'import'])->name('import');
        Route::get('/export', [PelakuUsahaController::class, 'export'])->name('export');
        Route::get('/template', [PelakuUsahaController::class, 'downloadTemplate'])->name('template');
        Route::delete('/bulk-destroy', [PelakuUsahaController::class, 'bulkDestroy'])->name('bulk-destroy');
        Route::get('/{pelakuUsaha}', [PelakuUsahaController::class, 'show'])->name('show');
        Route::get('/{pelakuUsaha}/edit', [PelakuUsahaController::class, 'edit'])->name('edit');
        Route::put('/{pelakuUsaha}', [PelakuUsahaController::class, 'update'])->name('update');
        Route::delete('/{pelakuUsaha}', [PelakuUsahaController::class, 'destroy'])->name('destroy');
        Route::post('/{pelakuUsaha}/toggle-status', [PelakuUsahaController::class, 'toggleStatus'])->name('toggle-status');
    });
});

require __DIR__ . '/auth.php';
