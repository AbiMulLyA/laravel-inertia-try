<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bidang_id')->constrained('bidang')->cascadeOnDelete();
            $table->string('kode', 20)->unique();
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->year('tahun_anggaran');
            $table->decimal('pagu_anggaran', 18, 2)->default(0);
            $table->decimal('realisasi_anggaran', 18, 2)->default(0);
            $table->enum('status', ['draft', 'aktif', 'selesai', 'dibatalkan'])->default('draft');
            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Composite indexes untuk query yang sering digunakan
            $table->index(['bidang_id', 'tahun_anggaran']);
            $table->index(['status', 'tahun_anggaran']);
            $table->index('tahun_anggaran');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program');
    }
};
