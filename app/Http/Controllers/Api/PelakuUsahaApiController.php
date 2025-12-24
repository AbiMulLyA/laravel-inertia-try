<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PelakuUsahaResource;
use App\Models\PelakuUsaha;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @group Pelaku Usaha
 *
 * API untuk mengelola data Pelaku Usaha/Petani/Peternak
 */
class PelakuUsahaApiController extends Controller
{
    /**
     * Get list of all pelaku usaha with optional filters
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = PelakuUsaha::query()
            ->with('bidang');

        // Filter by bidang
        if ($request->filled('bidang_id')) {
            $query->where('bidang_id', $request->input('bidang_id'));
        }

        // Filter by jenis usaha
        if ($request->filled('jenis_usaha')) {
            $query->where('jenis_usaha', $request->input('jenis_usaha'));
        }

        // Filter by kecamatan
        if ($request->filled('kecamatan')) {
            $query->where('kecamatan', $request->input('kecamatan'));
        }

        // Filter by desa
        if ($request->filled('desa')) {
            $query->where('desa', $request->input('desa'));
        }

        // Filter by kelompok tani
        if ($request->filled('kelompok_tani')) {
            $query->where('kelompok_tani', $request->input('kelompok_tani'));
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search by nama, NIK, or alamat
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'ilike', "%{$search}%")
                    ->orWhere('nik', 'ilike', "%{$search}%")
                    ->orWhere('alamat', 'ilike', "%{$search}%")
                    ->orWhere('kelompok_tani', 'ilike', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'nama');
        $sortDir = $request->input('sort_dir', 'asc');
        $query->orderBy($sortBy, $sortDir);

        // Pagination
        $perPage = min($request->input('per_page', 15), 100);

        return PelakuUsahaResource::collection($query->paginate($perPage));
    }

    /**
     * Get single pelaku usaha with relationships
     */
    public function show(PelakuUsaha $pelakuUsaha): PelakuUsahaResource
    {
        $pelakuUsaha->load('bidang');

        return new PelakuUsahaResource($pelakuUsaha);
    }

    /**
     * Create new pelaku usaha
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bidang_id' => 'required|exists:bidang,id',
            'nik' => 'required|string|max:20|unique:pelaku_usaha,nik',
            'nama' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'nullable|string',
            'kecamatan' => 'nullable|string|max:100',
            'desa' => 'nullable|string|max:100',
            'rt' => 'nullable|string|max:5',
            'rw' => 'nullable|string|max:5',
            'no_hp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'jenis_usaha' => 'required|string|max:100',
            'luas_lahan' => 'nullable|numeric|min:0',
            'jumlah_ternak' => 'nullable|integer|min:0',
            'komoditas' => 'nullable|array',
            'kelompok_tani' => 'nullable|string|max:255',
            'foto' => 'nullable|string',
            'is_active' => 'boolean',
            'dokumen' => 'nullable|array',
        ]);

        $pelakuUsaha = PelakuUsaha::create($validated);
        $pelakuUsaha->load('bidang');

        return response()->json([
            'success' => true,
            'message' => 'Pelaku usaha berhasil ditambahkan',
            'data' => new PelakuUsahaResource($pelakuUsaha),
        ], 201);
    }

    /**
     * Update existing pelaku usaha
     */
    public function update(Request $request, PelakuUsaha $pelakuUsaha): JsonResponse
    {
        $validated = $request->validate([
            'bidang_id' => 'sometimes|required|exists:bidang,id',
            'nik' => 'sometimes|required|string|max:20|unique:pelaku_usaha,nik,' . $pelakuUsaha->id,
            'nama' => 'sometimes|required|string|max:255',
            'jenis_kelamin' => 'sometimes|required|in:L,P',
            'alamat' => 'nullable|string',
            'kecamatan' => 'nullable|string|max:100',
            'desa' => 'nullable|string|max:100',
            'rt' => 'nullable|string|max:5',
            'rw' => 'nullable|string|max:5',
            'no_hp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'jenis_usaha' => 'sometimes|required|string|max:100',
            'luas_lahan' => 'nullable|numeric|min:0',
            'jumlah_ternak' => 'nullable|integer|min:0',
            'komoditas' => 'nullable|array',
            'kelompok_tani' => 'nullable|string|max:255',
            'foto' => 'nullable|string',
            'is_active' => 'boolean',
            'dokumen' => 'nullable|array',
        ]);

        $pelakuUsaha->update($validated);
        $pelakuUsaha->load('bidang');

        return response()->json([
            'success' => true,
            'message' => 'Pelaku usaha berhasil diperbarui',
            'data' => new PelakuUsahaResource($pelakuUsaha),
        ]);
    }

    /**
     * Toggle active status
     */
    public function toggleStatus(PelakuUsaha $pelakuUsaha): JsonResponse
    {
        $pelakuUsaha->update([
            'is_active' => !$pelakuUsaha->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status pelaku usaha berhasil diubah',
            'data' => new PelakuUsahaResource($pelakuUsaha),
        ]);
    }

    /**
     * Delete pelaku usaha
     */
    public function destroy(PelakuUsaha $pelakuUsaha): JsonResponse
    {
        $pelakuUsaha->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pelaku usaha berhasil dihapus',
        ]);
    }
}
