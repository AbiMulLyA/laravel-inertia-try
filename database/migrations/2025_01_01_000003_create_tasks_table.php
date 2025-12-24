<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tasks Table Migration
 * 
 * Example migration for full CRUD with progress tracking.
 * Demonstrates: multiple statuses, progress percentage, priority, rich metadata.
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('code', 30)->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->decimal('target', 15, 2)->default(0);
            $table->decimal('achieved', 15, 2)->default(0);
            $table->string('unit', 50)->default('unit');
            $table->decimal('budget', 18, 2)->default(0);
            $table->decimal('spent', 18, 2)->default(0);
            $table->enum('status', ['pending', 'in_progress', 'completed', 'on_hold'])->default('pending');
            $table->integer('progress')->default(0); // 0-100
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['project_id', 'status']);
            $table->index('status');
            $table->index('priority');
            $table->index(['start_date', 'end_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
