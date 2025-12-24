<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgramResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'bidang_id' => $this->bidang_id,
            'kode' => $this->kode,
            'nama' => $this->nama,
            'deskripsi' => $this->deskripsi,
            'tahun_anggaran' => $this->tahun_anggaran,
            'pagu_anggaran' => $this->pagu_anggaran,
            'realisasi_anggaran' => $this->realisasi_anggaran,
            'status' => $this->status,
            'tanggal_mulai' => $this->tanggal_mulai?->format('Y-m-d'),
            'tanggal_selesai' => $this->tanggal_selesai?->format('Y-m-d'),

            // Computed attributes
            'persentase_realisasi' => $this->persentase_realisasi,
            'total_kegiatan' => $this->whenCounted('kegiatan', $this->kegiatan_count),
            'progress_kegiatan' => $this->progress_kegiatan,

            // Relationships
            'bidang' => new BidangResource($this->whenLoaded('bidang')),
            'kegiatan' => KegiatanResource::collection($this->whenLoaded('kegiatan')),

            // Timestamps
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
