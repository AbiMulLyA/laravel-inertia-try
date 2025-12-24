<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bidang extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'bidang';

    protected $fillable = [
        'kode',
        'nama',
        'deskripsi',
        'kepala_bidang',
        'nip_kepala',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relationships
    public function program(): HasMany
    {
        return $this->hasMany(Program::class);
    }

    public function pelakuUsaha(): HasMany
    {
        return $this->hasMany(PelakuUsaha::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Accessors
    public function getTotalProgramAttribute(): int
    {
        return $this->program()->count();
    }

    public function getTotalPelakuUsahaAttribute(): int
    {
        return $this->pelakuUsaha()->count();
    }

    public function getTotalAnggaranAttribute(): float
    {
        return $this->program()->sum('pagu_anggaran');
    }
}
