<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Bidang;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ProgramController extends Controller
{
    /**
     * Display listing of program
     */
    public function index(Request $request): InertiaResponse
    {
        $tahun = $request->input('tahun', date('Y'));
        $bidangId = $request->input('bidang_id');

        $query = Program::with('bidang:id,kode,nama')
            ->withCount('kegiatan')
            ->where('tahun_anggaran', $tahun);

        if ($bidangId) {
            $query->where('bidang_id', $bidangId);
        }

        $program = $query->orderBy('kode')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'kode' => $item->kode,
                'nama' => $item->nama,
                'deskripsi' => $item->deskripsi,
                'bidang' => $item->bidang,
                'tahun_anggaran' => $item->tahun_anggaran,
                'pagu_anggaran' => $item->pagu_anggaran,
                'realisasi_anggaran' => $item->realisasi_anggaran,
                'persentase_realisasi' => $item->persentase_realisasi,
                'status' => $item->status,
                'total_kegiatan' => $item->kegiatan_count,
                'tanggal_mulai' => $item->tanggal_mulai?->format('Y-m-d'),
                'tanggal_selesai' => $item->tanggal_selesai?->format('Y-m-d'),
            ];
        });

        $bidang = Bidang::active()->select('id', 'kode', 'nama')->orderBy('nama')->get();

        // Calculate summary
        $summary = [
            'total_program' => $program->count(),
            'total_pagu' => $program->sum('pagu_anggaran'),
            'total_realisasi' => $program->sum('realisasi_anggaran'),
        ];

        return Inertia::render('Program/Index', [
            'program' => $program,
            'bidang' => $bidang,
            'filters' => [
                'tahun' => (int) $tahun,
                'bidang_id' => $bidangId,
            ],
            'summary' => $summary,
        ]);
    }

    /**
     * Show create form
     */
    public function create(): InertiaResponse
    {
        $bidang = Bidang::active()->select('id', 'kode', 'nama')->orderBy('nama')->get();

        return Inertia::render('Program/Form', [
            'bidang' => $bidang,
        ]);
    }

    /**
     * Store new program
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bidang_id' => 'required|exists:bidang,id',
            'kode' => 'required|string|max:50|unique:program,kode',
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tahun_anggaran' => 'required|integer|min:2020|max:2100',
            'pagu_anggaran' => 'required|numeric|min:0',
            'status' => 'required|in:draft,aktif,selesai',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
        ]);

        Program::create($validated);

        return redirect()
            ->route('program.index')
            ->with('success', 'Program berhasil ditambahkan.');
    }

    /**
     * Show edit form
     */
    public function edit(Program $program): InertiaResponse
    {
        $bidang = Bidang::active()->select('id', 'kode', 'nama')->orderBy('nama')->get();

        return Inertia::render('Program/Form', [
            'program' => $program,
            'bidang' => $bidang,
        ]);
    }

    /**
     * Update program
     */
    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'bidang_id' => 'required|exists:bidang,id',
            'kode' => 'required|string|max:50|unique:program,kode,' . $program->id,
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tahun_anggaran' => 'required|integer|min:2020|max:2100',
            'pagu_anggaran' => 'required|numeric|min:0',
            'realisasi_anggaran' => 'nullable|numeric|min:0',
            'status' => 'required|in:draft,aktif,selesai',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
        ]);

        $program->update($validated);

        return redirect()
            ->route('program.index')
            ->with('success', 'Program berhasil diperbarui.');
    }

    /**
     * Delete program
     */
    public function destroy(Program $program)
    {
        if ($program->kegiatan()->exists()) {
            return back()->with('error', 'Program tidak dapat dihapus karena masih memiliki kegiatan terkait.');
        }

        $program->delete();

        return redirect()
            ->route('program.index')
            ->with('success', 'Program berhasil dihapus.');
    }
}
