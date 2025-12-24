<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BidangResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kode' => $this->kode,
            'nama' => $this->nama,
            'deskripsi' => $this->deskripsi,
            'kepala_bidang' => $this->kepala_bidang,
            'nip_kepala' => $this->nip_kepala,
            'is_active' => $this->is_active,

            // Computed attributes
            'total_program' => $this->whenCounted('program', $this->program_count),
            'total_pelaku_usaha' => $this->whenCounted('pelakuUsaha', $this->pelaku_usaha_count),

            // Relationships
            'program' => ProgramResource::collection($this->whenLoaded('program')),
            'pelaku_usaha' => PelakuUsahaResource::collection($this->whenLoaded('pelakuUsaha')),

            // Timestamps
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
