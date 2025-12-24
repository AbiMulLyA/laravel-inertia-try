<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kegiatan extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'kegiatan';

    protected $fillable = [
        'program_id',
        'kode',
        'nama',
        'deskripsi',
        'lokasi',
        'kecamatan',
        'desa',
        'target',
        'realisasi',
        'satuan',
        'anggaran',
        'realisasi_anggaran',
        'status',
        'progress',
        'tanggal_mulai',
        'tanggal_selesai',
        'dokumentasi',
        'catatan',
    ];

    protected $casts = [
        'target' => 'decimal:2',
        'realisasi' => 'decimal:2',
        'anggaran' => 'decimal:2',
        'realisasi_anggaran' => 'decimal:2',
        'progress' => 'integer',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'dokumentasi' => 'array',
    ];

    // Relationships
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    // Scopes
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeKecamatan($query, string $kecamatan)
    {
        return $query->where('kecamatan', $kecamatan);
    }

    public function scopeBerjalan($query)
    {
        return $query->where('status', 'berjalan');
    }

    // Accessors
    public function getPersentaseRealisasiAttribute(): float
    {
        if ($this->target == 0) {
            return 0;
        }
        return round(($this->realisasi / $this->target) * 100, 2);
    }

    public function getPersentaseAnggaranAttribute(): float
    {
        if ($this->anggaran == 0) {
            return 0;
        }
        return round(($this->realisasi_anggaran / $this->anggaran) * 100, 2);
    }

    public function getBidangAttribute()
    {
        return $this->program?->bidang;
    }
}
