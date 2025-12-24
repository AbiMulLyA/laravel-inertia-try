<?php

namespace App\Http\Requests;

use App\Models\PelakuUsaha;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePelakuUsahaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bidang_id' => ['required', 'exists:bidang,id'],
            'nik' => ['required', 'string', 'size:16', Rule::unique('pelaku_usaha', 'nik')->ignore($this->pelakuUsaha)],
            'nama' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            'alamat' => ['required', 'string'],
            'kecamatan' => ['required', 'string', 'max:100'],
            'desa' => ['required', 'string', 'max:100'],
            'rt' => ['nullable', 'string', 'max:5'],
            'rw' => ['nullable', 'string', 'max:5'],
            'no_hp' => ['nullable', 'string', 'max:15'],
            'email' => ['nullable', 'email', 'max:255'],
            'jenis_usaha' => ['required', Rule::in(array_keys(PelakuUsaha::JENIS_USAHA))],
            'luas_lahan' => ['nullable', 'numeric', 'min:0'],
            'jumlah_ternak' => ['nullable', 'integer', 'min:0'],
            'komoditas' => ['nullable', 'array'],
            'komoditas.*' => ['string', 'max:100'],
            'kelompok_tani' => ['nullable', 'string', 'max:255'],
            'foto' => ['nullable', 'image', 'max:2048'],
            'dokumen' => ['nullable', 'array'],
            'dokumen.*' => ['file', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'nik.required' => 'NIK wajib diisi.',
            'nik.size' => 'NIK harus 16 digit.',
            'nik.unique' => 'NIK sudah terdaftar.',
            'nama.required' => 'Nama wajib diisi.',
            'bidang_id.required' => 'Bidang wajib dipilih.',
            'bidang_id.exists' => 'Bidang tidak valid.',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
            'alamat.required' => 'Alamat wajib diisi.',
            'kecamatan.required' => 'Kecamatan wajib diisi.',
            'desa.required' => 'Desa wajib diisi.',
            'jenis_usaha.required' => 'Jenis usaha wajib dipilih.',
        ];
    }
}
