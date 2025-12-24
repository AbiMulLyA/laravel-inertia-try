<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Laravel 12.11 - API Resource with automatic model binding
 * 
 * Dapat dipanggil dengan: $pelakuUsaha->toResource()
 */
class PelakuUsahaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nik' => $this->nik,
            'nama' => $this->nama,
            'jenis_kelamin' => $this->jenis_kelamin,
            'alamat' => $this->alamat,
            'alamat_lengkap' => $this->alamat_lengkap,
            'kecamatan' => $this->kecamatan,
            'desa' => $this->desa,
            'rt' => $this->rt,
            'rw' => $this->rw,
            'no_hp' => $this->no_hp,
            'email' => $this->email,
            'jenis_usaha' => $this->jenis_usaha,
            'jenis_usaha_label' => $this->jenis_usaha_label,
            'luas_lahan' => $this->luas_lahan,
            'jumlah_ternak' => $this->jumlah_ternak,
            'komoditas' => $this->komoditas,
            'kelompok_tani' => $this->kelompok_tani,
            'foto' => $this->foto,
            'is_active' => $this->is_active,
            
            // Relationships - auto eager-loaded in Laravel 12.11
            'bidang' => $this->whenLoaded('bidang', fn () => [
                'id' => $this->bidang->id,
                'nama' => $this->bidang->nama,
                'kode' => $this->bidang->kode,
            ]),
            
            // Timestamps
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
