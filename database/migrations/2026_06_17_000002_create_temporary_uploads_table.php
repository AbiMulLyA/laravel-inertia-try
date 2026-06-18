<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('temporary_uploads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('category', 50)->index();
            $table->string('collection', 80)->default('attachments')->index();
            $table->string('disk', 80);
            $table->string('visibility', 20)->default('private');
            $table->string('path');
            $table->string('optimized_path')->nullable();
            $table->string('original_name');
            $table->string('stored_name');
            $table->string('extension', 20)->index();
            $table->string('mime_type', 150)->nullable();
            $table->unsignedBigInteger('size');
            $table->unsignedBigInteger('optimized_size')->nullable();
            $table->string('checksum', 64)->nullable()->index();
            $table->boolean('is_optimized')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamp('expires_at')->index();
            $table->timestamps();

            $table->index(['user_id', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('temporary_uploads');
    }
};
