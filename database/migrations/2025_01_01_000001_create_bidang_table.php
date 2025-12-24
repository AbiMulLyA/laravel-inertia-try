<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bidang', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 10)->unique();
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->string('kepala_bidang')->nullable();
            $table->string('nip_kepala')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            // Indexes untuk optimasi query
            $table->index('is_active');
            $table->index('nama');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bidang');
    }
};
