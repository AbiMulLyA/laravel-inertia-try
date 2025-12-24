<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Attributes\UseResource;
use App\Http\Resources\PelakuUsahaResource;

/**
 * Laravel 12.11 - Using API Resource Attribute
 */
#[UseResource(PelakuUsahaResource::class)]
class PelakuUsaha extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pelaku_usaha';

    protected $fillable = [
        'bidang_id',
        'nik',
        'nama',
        'jenis_kelamin',
        'alamat',
        'kecamatan',
        'desa',
        'rt',
        'rw',
        'no_hp',
        'email',
        'jenis_usaha',
        'luas_lahan',
        'jumlah_ternak',
        'komoditas',
        'kelompok_tani',
        'foto',
        'is_active',
        'dokumen',
    ];

    protected $casts = [
        'luas_lahan' => 'decimal:2',
        'jumlah_ternak' => 'integer',
        'komoditas' => 'array',
        'dokumen' => 'array',
        'is_active' => 'boolean',
    ];

    // Konstanta untuk jenis usaha
    const JENIS_USAHA = [
        'petani_padi' => 'Petani Padi',
        'petani_palawija' => 'Petani Palawija',
        'petani_hortikultura' => 'Petani Hortikultura',
        'peternak_sapi' => 'Peternak Sapi',
        'peternak_kambing' => 'Peternak Kambing',
        'peternak_ayam' => 'Peternak Ayam',
        'peternak_ikan' => 'Peternak Ikan',
        'pengolah_pangan' => 'Pengolah Pangan',
        'distributor' => 'Distributor',
        'lainnya' => 'Lainnya',
    ];

    // Relationships - Laravel 12.11 automatic eager loading will handle N+1
    public function bidang(): BelongsTo
    {
        return $this->belongsTo(Bidang::class);
    }

    // Scopes untuk filtering
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeByBidang(Builder $query, int $bidangId): Builder
    {
        return $query->where('bidang_id', $bidangId);
    }

    public function scopeByJenisUsaha(Builder $query, string $jenisUsaha): Builder
    {
        return $query->where('jenis_usaha', $jenisUsaha);
    }

    public function scopeByKecamatan(Builder $query, string $kecamatan): Builder
    {
        return $query->where('kecamatan', $kecamatan);
    }

    public function scopeByDesa(Builder $query, string $desa): Builder
    {
        return $query->where('desa', $desa);
    }

    public function scopeByKelompokTani(Builder $query, string $kelompokTani): Builder
    {
        return $query->where('kelompok_tani', $kelompokTani);
    }

    // Full-text search scope untuk PostgreSQL 18
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->whereRaw(
            "to_tsvector('indonesian', nama || ' ' || alamat || ' ' || COALESCE(kelompok_tani, '')) @@ plainto_tsquery('indonesian', ?)",
            [$search]
        );
    }

    // Optimized scope untuk heavy data - hanya select kolom yang dibutuhkan
    public function scopeListView(Builder $query): Builder
    {
        return $query->select([
            'id',
            'bidang_id',
            'nik',
            'nama',
            'kecamatan',
            'desa',
            'jenis_usaha',
            'kelompok_tani',
            'is_active',
        ]);
    }

    // Accessors
    public function getJenisUsahaLabelAttribute(): string
    {
        return self::JENIS_USAHA[$this->jenis_usaha] ?? $this->jenis_usaha;
    }

    public function getAlamatLengkapAttribute(): string
    {
        $parts = array_filter([
            $this->alamat,
            $this->rt ? "RT {$this->rt}" : null,
            $this->rw ? "RW {$this->rw}" : null,
            $this->desa,
            $this->kecamatan,
        ]);
        return implode(', ', $parts);
    }
}
