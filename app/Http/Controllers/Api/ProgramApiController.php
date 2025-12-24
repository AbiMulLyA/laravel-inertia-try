<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgramResource;
use App\Models\Program;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @group Program
 *
 * API untuk mengelola data Program Kerja
 */
class ProgramApiController extends Controller
{
    /**
     * Get list of all program with optional filters
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Program::query()
            ->with('bidang')
            ->withCount('kegiatan');

        // Filter by bidang
        if ($request->filled('bidang_id')) {
            $query->where('bidang_id', $request->input('bidang_id'));
        }

        // Filter by tahun anggaran
        if ($request->filled('tahun')) {
            $query->where('tahun_anggaran', $request->input('tahun'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Search by nama or kode
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'ilike', "%{$search}%")
                    ->orWhere('kode', 'ilike', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        // Pagination
        $perPage = min($request->input('per_page', 15), 100);

        return ProgramResource::collection($query->paginate($perPage));
    }

    /**
     * Get single program with relationships
     */
    public function show(Program $program): ProgramResource
    {
        $program->load(['bidang', 'kegiatan']);
        $program->loadCount('kegiatan');

        return new ProgramResource($program);
    }

    /**
     * Create new program
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bidang_id' => 'required|exists:bidang,id',
            'kode' => 'required|string|max:50|unique:program,kode',
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tahun_anggaran' => 'required|integer|min:2020|max:2100',
            'pagu_anggaran' => 'required|numeric|min:0',
            'realisasi_anggaran' => 'nullable|numeric|min:0',
            'status' => 'required|in:aktif,selesai,tertunda,batal',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
        ]);

        $program = Program::create($validated);
        $program->load('bidang');

        return response()->json([
            'success' => true,
            'message' => 'Program berhasil ditambahkan',
            'data' => new ProgramResource($program),
        ], 201);
    }

    /**
     * Update existing program
     */
    public function update(Request $request, Program $program): JsonResponse
    {
        $validated = $request->validate([
            'bidang_id' => 'sometimes|required|exists:bidang,id',
            'kode' => 'sometimes|required|string|max:50|unique:program,kode,' . $program->id,
            'nama' => 'sometimes|required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tahun_anggaran' => 'sometimes|required|integer|min:2020|max:2100',
            'pagu_anggaran' => 'sometimes|required|numeric|min:0',
            'realisasi_anggaran' => 'nullable|numeric|min:0',
            'status' => 'sometimes|required|in:aktif,selesai,tertunda,batal',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
        ]);

        $program->update($validated);
        $program->load('bidang');

        return response()->json([
            'success' => true,
            'message' => 'Program berhasil diperbarui',
            'data' => new ProgramResource($program),
        ]);
    }

    /**
     * Delete program
     */
    public function destroy(Program $program): JsonResponse
    {
        // Check for related kegiatan
        if ($program->kegiatan()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus program yang memiliki kegiatan',
            ], 422);
        }

        $program->delete();

        return response()->json([
            'success' => true,
            'message' => 'Program berhasil dihapus',
        ]);
    }
}
