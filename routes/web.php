<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Kominfo Laravel Inertia Base - Web Routes
|
*/

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // ================================================
    // Dashboard
    // ================================================
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ================================================
    // Master Data
    // ================================================
    Route::resource('categories', CategoryController::class);
    Route::resource('projects', ProjectController::class);
    Route::resource('tasks', TaskController::class);
    Route::patch('/tasks/{task}/progress', [TaskController::class, 'updateProgress'])
        ->name('tasks.update-progress');

    // ================================================
    // Reports
    // ================================================
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/budget', [ReportController::class, 'budget'])->name('budget');
        Route::get('/spending', [ReportController::class, 'spending'])->name('spending');
        Route::get('/project-progress', [ReportController::class, 'projectProgress'])->name('project-progress');
        Route::get('/task-progress', [ReportController::class, 'taskProgress'])->name('task-progress');
    });

    // ================================================
    // Settings
    // ================================================
    Route::prefix('settings')->name('settings.')->group(function () {
        // Appearance
        Route::get('/appearance', [SettingsController::class, 'appearance'])->name('appearance');

        // User Management
        Route::resource('users', UserController::class);
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
    });

    // ================================================
    // Profile
    // ================================================
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
});

require __DIR__.'/auth.php';
