<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Kominfo Laravel Inertia Base - Web Routes
| These routes are loaded by the RouteServiceProvider within the "web" middleware group.
|
*/

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ================================================
    // Categories - Master Data Example
    // ================================================
    Route::resource('categories', CategoryController::class);

    // ================================================
    // Projects - Relational Data Example
    // ================================================
    Route::resource('projects', ProjectController::class);

    // ================================================
    // Tasks - Full CRUD with Progress Example
    // ================================================
    Route::resource('tasks', TaskController::class);
    Route::patch('/tasks/{task}/progress', [TaskController::class, 'updateProgress'])
        ->name('tasks.update-progress');

    // ================================================
    // Add your custom routes here
    // ================================================
    // Route::resource('your-model', YourModelController::class);
});

require __DIR__ . '/auth.php';
