<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Projects Table Migration
 * 
 * Example migration for relational data.
 * Demonstrates: foreign key, status enum, budget tracking, date range.
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('code', 30)->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->year('year');
            $table->decimal('budget', 18, 2)->default(0);
            $table->decimal('spent', 18, 2)->default(0);
            $table->enum('status', ['draft', 'active', 'completed'])->default('draft');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Composite indexes for common queries
            $table->index(['category_id', 'year']);
            $table->index(['status', 'year']);
            $table->index('year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
