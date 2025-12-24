<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\KegiatanResource;
use App\Models\Kegiatan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @group Kegiatan
 *
 * API untuk mengelola data Kegiatan dalam Program
 */
class KegiatanApiController extends Controller
{
    /**
     * Get list of all kegiatan with optional filters
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Kegiatan::query()
            ->with(['program.bidang']);

        // Filter by program
        if ($request->filled('program_id')) {
            $query->where('program_id', $request->input('program_id'));
        }

        // Filter by bidang (through program)
        if ($request->filled('bidang_id')) {
            $query->whereHas('program', function ($q) use ($request) {
                $q->where('bidang_id', $request->input('bidang_id'));
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by kecamatan
        if ($request->filled('kecamatan')) {
            $query->where('kecamatan', $request->input('kecamatan'));
        }

        // Filter by desa
        if ($request->filled('desa')) {
            $query->where('desa', $request->input('desa'));
        }

        // Filter by progress range
        if ($request->filled('min_progress')) {
            $query->where('progress', '>=', $request->input('min_progress'));
        }
        if ($request->filled('max_progress')) {
            $query->where('progress', '<=', $request->input('max_progress'));
        }

        // Search by nama or kode
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'ilike', "%{$search}%")
                    ->orWhere('kode', 'ilike', "%{$search}%")
                    ->orWhere('lokasi', 'ilike', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        // Pagination
        $perPage = min($request->input('per_page', 15), 100);

        return KegiatanResource::collection($query->paginate($perPage));
    }

    /**
     * Get single kegiatan with relationships
     */
    public function show(Kegiatan $kegiatan): KegiatanResource
    {
        $kegiatan->load(['program.bidang']);

        return new KegiatanResource($kegiatan);
    }

    /**
     * Create new kegiatan
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'program_id' => 'required|exists:program,id',
            'kode' => 'required|string|max:50|unique:kegiatan,kode',
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'lokasi' => 'nullable|string|max:255',
            'kecamatan' => 'nullable|string|max:100',
            'desa' => 'nullable|string|max:100',
            'target' => 'required|numeric|min:0',
            'realisasi' => 'nullable|numeric|min:0',
            'satuan' => 'required|string|max:50',
            'anggaran' => 'required|numeric|min:0',
            'realisasi_anggaran' => 'nullable|numeric|min:0',
            'status' => 'required|in:belum_mulai,berjalan,selesai,tertunda,batal',
            'progress' => 'nullable|integer|min:0|max:100',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'dokumentasi' => 'nullable|array',
            'catatan' => 'nullable|string',
        ]);

        $kegiatan = Kegiatan::create($validated);
        $kegiatan->load(['program.bidang']);

        return response()->json([
            'success' => true,
            'message' => 'Kegiatan berhasil ditambahkan',
            'data' => new KegiatanResource($kegiatan),
        ], 201);
    }

    /**
     * Update existing kegiatan
     */
    public function update(Request $request, Kegiatan $kegiatan): JsonResponse
    {
        $validated = $request->validate([
            'program_id' => 'sometimes|required|exists:program,id',
            'kode' => 'sometimes|required|string|max:50|unique:kegiatan,kode,' . $kegiatan->id,
            'nama' => 'sometimes|required|string|max:255',
            'deskripsi' => 'nullable|string',
            'lokasi' => 'nullable|string|max:255',
            'kecamatan' => 'nullable|string|max:100',
            'desa' => 'nullable|string|max:100',
            'target' => 'sometimes|required|numeric|min:0',
            'realisasi' => 'nullable|numeric|min:0',
            'satuan' => 'sometimes|required|string|max:50',
            'anggaran' => 'sometimes|required|numeric|min:0',
            'realisasi_anggaran' => 'nullable|numeric|min:0',
            'status' => 'sometimes|required|in:belum_mulai,berjalan,selesai,tertunda,batal',
            'progress' => 'nullable|integer|min:0|max:100',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'dokumentasi' => 'nullable|array',
            'catatan' => 'nullable|string',
        ]);

        $kegiatan->update($validated);
        $kegiatan->load(['program.bidang']);

        return response()->json([
            'success' => true,
            'message' => 'Kegiatan berhasil diperbarui',
            'data' => new KegiatanResource($kegiatan),
        ]);
    }

    /**
     * Update progress kegiatan
     */
    public function updateProgress(Request $request, Kegiatan $kegiatan): JsonResponse
    {
        $validated = $request->validate([
            'progress' => 'required|integer|min:0|max:100',
            'realisasi' => 'nullable|numeric|min:0',
            'realisasi_anggaran' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:belum_mulai,berjalan,selesai,tertunda,batal',
            'catatan' => 'nullable|string',
        ]);

        $kegiatan->update($validated);
        $kegiatan->load(['program.bidang']);

        return response()->json([
            'success' => true,
            'message' => 'Progress kegiatan berhasil diperbarui',
            'data' => new KegiatanResource($kegiatan),
        ]);
    }

    /**
     * Delete kegiatan
     */
    public function destroy(Kegiatan $kegiatan): JsonResponse
    {
        $kegiatan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kegiatan berhasil dihapus',
        ]);
    }
}
