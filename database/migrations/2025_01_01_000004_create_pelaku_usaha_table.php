<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pelaku_usaha', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bidang_id')->constrained('bidang')->cascadeOnDelete();
            $table->string('nik', 16)->unique();
            $table->string('nama');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->text('alamat');
            $table->string('kecamatan');
            $table->string('desa');
            $table->string('rt', 5)->nullable();
            $table->string('rw', 5)->nullable();
            $table->string('no_hp', 15)->nullable();
            $table->string('email')->nullable();
            $table->enum('jenis_usaha', [
                'petani_padi',
                'petani_palawija', 
                'petani_hortikultura',
                'peternak_sapi',
                'peternak_kambing',
                'peternak_ayam',
                'peternak_ikan',
                'pengolah_pangan',
                'distributor',
                'lainnya'
            ]);
            $table->decimal('luas_lahan', 10, 2)->nullable(); // dalam hektar
            $table->integer('jumlah_ternak')->nullable();
            $table->json('komoditas')->nullable(); // Array of komoditas
            $table->string('kelompok_tani')->nullable();
            $table->string('foto')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('dokumen')->nullable(); // KTP, Surat Tanah, etc.
            $table->timestamps();
            $table->softDeletes();

            // Indexes untuk pencarian dan filter
            $table->index(['bidang_id', 'jenis_usaha']);
            $table->index(['kecamatan', 'desa']);
            $table->index('jenis_usaha');
            $table->index('kelompok_tani');
            $table->index('is_active');
            
            // Full-text search index untuk PostgreSQL
            $table->fullText(['nama', 'alamat', 'kelompok_tani']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pelaku_usaha');
    }
};
