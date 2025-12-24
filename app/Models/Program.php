<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Program extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'program';

    protected $fillable = [
        'bidang_id',
        'kode',
        'nama',
        'deskripsi',
        'tahun_anggaran',
        'pagu_anggaran',
        'realisasi_anggaran',
        'status',
        'tanggal_mulai',
        'tanggal_selesai',
    ];

    protected $casts = [
        'pagu_anggaran' => 'decimal:2',
        'realisasi_anggaran' => 'decimal:2',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    // Relationships
    public function bidang(): BelongsTo
    {
        return $this->belongsTo(Bidang::class);
    }

    public function kegiatan(): HasMany
    {
        return $this->hasMany(Kegiatan::class);
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    public function scopeTahun($query, int $tahun)
    {
        return $query->where('tahun_anggaran', $tahun);
    }

    public function scopeByBidang($query, int $bidangId)
    {
        return $query->where('bidang_id', $bidangId);
    }

    // Accessors
    public function getPersentaseRealisasiAttribute(): float
    {
        if ($this->pagu_anggaran == 0) {
            return 0;
        }
        return round(($this->realisasi_anggaran / $this->pagu_anggaran) * 100, 2);
    }

    public function getTotalKegiatanAttribute(): int
    {
        return $this->kegiatan()->count();
    }

    public function getProgressKegiatanAttribute(): float
    {
        $kegiatan = $this->kegiatan;
        if ($kegiatan->isEmpty()) {
            return 0;
        }
        return round($kegiatan->avg('progress'), 2);
    }
}
