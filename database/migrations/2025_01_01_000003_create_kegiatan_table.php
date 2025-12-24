<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kegiatan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('program')->cascadeOnDelete();
            $table->string('kode', 30)->unique();
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->string('lokasi')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('desa')->nullable();
            $table->decimal('target', 15, 2)->default(0);
            $table->decimal('realisasi', 15, 2)->default(0);
            $table->string('satuan', 50)->default('unit');
            $table->decimal('anggaran', 18, 2)->default(0);
            $table->decimal('realisasi_anggaran', 18, 2)->default(0);
            $table->enum('status', ['belum_mulai', 'berjalan', 'selesai', 'tertunda'])->default('belum_mulai');
            $table->integer('progress')->default(0); // 0-100
            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->json('dokumentasi')->nullable(); // Array of image URLs
            $table->text('catatan')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['program_id', 'status']);
            $table->index('kecamatan');
            $table->index('status');
            $table->index(['tanggal_mulai', 'tanggal_selesai']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kegiatan');
    }
};
