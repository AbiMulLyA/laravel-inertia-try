<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KegiatanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'program_id' => $this->program_id,
            'kode' => $this->kode,
            'nama' => $this->nama,
            'deskripsi' => $this->deskripsi,
            'lokasi' => $this->lokasi,
            'kecamatan' => $this->kecamatan,
            'desa' => $this->desa,
            'target' => $this->target,
            'realisasi' => $this->realisasi,
            'satuan' => $this->satuan,
            'anggaran' => $this->anggaran,
            'realisasi_anggaran' => $this->realisasi_anggaran,
            'status' => $this->status,
            'progress' => $this->progress,
            'tanggal_mulai' => $this->tanggal_mulai?->format('Y-m-d'),
            'tanggal_selesai' => $this->tanggal_selesai?->format('Y-m-d'),
            'dokumentasi' => $this->dokumentasi,
            'catatan' => $this->catatan,

            // Computed attributes
            'persentase_realisasi' => $this->persentase_realisasi,
            'persentase_anggaran' => $this->persentase_anggaran,

            // Relationships
            'program' => new ProgramResource($this->whenLoaded('program')),
            'bidang' => $this->when($this->relationLoaded('program') && $this->program?->relationLoaded('bidang'), function () {
                return new BidangResource($this->program->bidang);
            }),

            // Timestamps
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
