<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BidangResource;
use App\Models\Bidang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @group Bidang
 *
 * API untuk mengelola data Bidang/Unit Kerja
 */
class BidangApiController extends Controller
{
    /**
     * Get list of all bidang with optional filters
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Bidang::query()
            ->withCount(['program', 'pelakuUsaha']);

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
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
        $sortBy = $request->input('sort_by', 'nama');
        $sortDir = $request->input('sort_dir', 'asc');
        $query->orderBy($sortBy, $sortDir);

        // Pagination
        $perPage = min($request->input('per_page', 15), 100);

        return BidangResource::collection($query->paginate($perPage));
    }

    /**
     * Get single bidang with relationships
     */
    public function show(Bidang $bidang): BidangResource
    {
        $bidang->loadCount(['program', 'pelakuUsaha']);
        $bidang->load([
            'program' => function ($query) {
                $query->latest()->limit(10);
            }
        ]);

        return new BidangResource($bidang);
    }

    /**
     * Create new bidang
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:20|unique:bidang,kode',
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'kepala_bidang' => 'nullable|string|max:255',
            'nip_kepala' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        $bidang = Bidang::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Bidang berhasil ditambahkan',
            'data' => new BidangResource($bidang),
        ], 201);
    }

    /**
     * Update existing bidang
     */
    public function update(Request $request, Bidang $bidang): JsonResponse
    {
        $validated = $request->validate([
            'kode' => 'sometimes|required|string|max:20|unique:bidang,kode,' . $bidang->id,
            'nama' => 'sometimes|required|string|max:255',
            'deskripsi' => 'nullable|string',
            'kepala_bidang' => 'nullable|string|max:255',
            'nip_kepala' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        $bidang->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Bidang berhasil diperbarui',
            'data' => new BidangResource($bidang),
        ]);
    }

    /**
     * Delete bidang
     */
    public function destroy(Bidang $bidang): JsonResponse
    {
        // Check for related data
        if ($bidang->program()->exists() || $bidang->pelakuUsaha()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus bidang yang memiliki program atau pelaku usaha',
            ], 422);
        }

        $bidang->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bidang berhasil dihapus',
        ]);
    }
}
