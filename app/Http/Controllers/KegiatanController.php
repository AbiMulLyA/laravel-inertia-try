<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class KegiatanController extends Controller
{
    /**
     * Display listing of kegiatan
     */
    public function index(Request $request): InertiaResponse
    {
        $programId = $request->input('program_id');
        $status = $request->input('status');
        $kecamatan = $request->input('kecamatan');
        $search = $request->input('search');

        $query = Kegiatan::with(['program:id,kode,nama', 'program.bidang:id,kode,nama']);

        if ($programId) {
            $query->where('program_id', $programId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($kecamatan) {
            $query->where('kecamatan', $kecamatan);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode', 'like', "%{$search}%")
                    ->orWhere('lokasi', 'like', "%{$search}%");
            });
        }

        $kegiatan = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'kode' => $item->kode,
                    'nama' => $item->nama,
                    'program' => $item->program,
                    'lokasi' => $item->lokasi,
                    'kecamatan' => $item->kecamatan,
                    'desa' => $item->desa,
                    'target' => $item->target,
                    'realisasi' => $item->realisasi,
                    'satuan' => $item->satuan,
                    'anggaran' => $item->anggaran,
                    'realisasi_anggaran' => $item->realisasi_anggaran,
                    'status' => $item->status,
                    'progress' => $item->progress,
                    'persentase_realisasi' => $item->persentase_realisasi,
                    'tanggal_mulai' => $item->tanggal_mulai?->format('Y-m-d'),
                    'tanggal_selesai' => $item->tanggal_selesai?->format('Y-m-d'),
                ];
            });

        $program = Program::with('bidang:id,kode,nama')
            ->select('id', 'bidang_id', 'kode', 'nama')
            ->orderBy('nama')
            ->get();

        $kecamatanList = Kegiatan::select('kecamatan')
            ->distinct()
            ->whereNotNull('kecamatan')
            ->orderBy('kecamatan')
            ->pluck('kecamatan');

        // Summary statistics
        $summary = [
            'total' => Kegiatan::count(),
            'berjalan' => Kegiatan::where('status', 'berjalan')->count(),
            'selesai' => Kegiatan::where('status', 'selesai')->count(),
            'lainnya' => Kegiatan::whereNotIn('status', ['berjalan', 'selesai'])->count(),
        ];

        return Inertia::render('Kegiatan/Index', [
            'kegiatan' => $kegiatan,
            'program' => $program,
            'kecamatanList' => $kecamatanList,
            'filters' => [
                'program_id' => $programId,
                'status' => $status,
                'kecamatan' => $kecamatan,
                'search' => $search,
            ],
            'summary' => $summary,
        ]);
    }

    /**
     * Show create form
     */
    public function create(): InertiaResponse
    {
        $program = Program::with('bidang:id,kode,nama')
            ->select('id', 'bidang_id', 'kode', 'nama')
            ->orderBy('nama')
            ->get();

        return Inertia::render('Kegiatan/Form', [
            'program' => $program,
        ]);
    }

    /**
     * Store new kegiatan
     */
    public function store(Request $request)
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
            'satuan' => 'required|string|max:50',
            'anggaran' => 'required|numeric|min:0',
            'status' => 'required|in:draft,berjalan,selesai,dibatalkan',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
        ]);

        Kegiatan::create($validated);

        return redirect()
            ->route('kegiatan.index')
            ->with('success', 'Kegiatan berhasil ditambahkan.');
    }

    /**
     * Show kegiatan detail
     */
    public function show(Kegiatan $kegiatan): InertiaResponse
    {
        $kegiatan->load(['program.bidang']);

        return Inertia::render('Kegiatan/Show', [
            'kegiatan' => $kegiatan,
        ]);
    }

    /**
     * Show edit form
     */
    public function edit(Kegiatan $kegiatan): InertiaResponse
    {
        $program = Program::with('bidang:id,kode,nama')
            ->select('id', 'bidang_id', 'kode', 'nama')
            ->orderBy('nama')
            ->get();

        return Inertia::render('Kegiatan/Form', [
            'kegiatan' => $kegiatan,
            'program' => $program,
        ]);
    }

    /**
     * Update kegiatan
     */
    public function update(Request $request, Kegiatan $kegiatan)
    {
        $validated = $request->validate([
            'program_id' => 'required|exists:program,id',
            'kode' => 'required|string|max:50|unique:kegiatan,kode,' . $kegiatan->id,
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
            'status' => 'required|in:draft,berjalan,selesai,dibatalkan',
            'progress' => 'nullable|integer|min:0|max:100',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'catatan' => 'nullable|string',
        ]);

        $kegiatan->update($validated);

        return redirect()
            ->route('kegiatan.index')
            ->with('success', 'Kegiatan berhasil diperbarui.');
    }

    /**
     * Delete kegiatan
     */
    public function destroy(Kegiatan $kegiatan)
    {
        $kegiatan->delete();

        return redirect()
            ->route('kegiatan.index')
            ->with('success', 'Kegiatan berhasil dihapus.');
    }

    /**
     * Update progress
     */
    public function updateProgress(Request $request, Kegiatan $kegiatan)
    {
        $validated = $request->validate([
            'progress' => 'required|integer|min:0|max:100',
            'realisasi' => 'nullable|numeric|min:0',
            'realisasi_anggaran' => 'nullable|numeric|min:0',
            'catatan' => 'nullable|string',
        ]);

        $kegiatan->update($validated);

        return back()->with('success', 'Progress kegiatan berhasil diperbarui.');
    }
}
