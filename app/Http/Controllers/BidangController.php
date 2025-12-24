<?php

namespace App\Http\Controllers;

use App\Models\Bidang;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class BidangController extends Controller
{
    /**
     * Display listing of bidang
     */
    public function index(): InertiaResponse
    {
        $bidang = Bidang::withCount(['program', 'pelakuUsaha'])
            ->with([
                'program' => function ($query) {
                    $query->select('id', 'bidang_id', 'pagu_anggaran', 'realisasi_anggaran');
                }
            ])
            ->orderBy('kode')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'kode' => $item->kode,
                    'nama' => $item->nama,
                    'deskripsi' => $item->deskripsi,
                    'kepala_bidang' => $item->kepala_bidang,
                    'nip_kepala' => $item->nip_kepala,
                    'is_active' => $item->is_active,
                    'total_program' => $item->program_count,
                    'total_pelaku_usaha' => $item->pelaku_usaha_count,
                    'total_anggaran' => $item->program->sum('pagu_anggaran'),
                    'total_realisasi' => $item->program->sum('realisasi_anggaran'),
                ];
            });

        return Inertia::render('Bidang/Index', [
            'bidang' => $bidang,
        ]);
    }

    /**
     * Show create form
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Bidang/Form');
    }

    /**
     * Store new bidang
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:10|unique:bidang,kode',
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'kepala_bidang' => 'nullable|string|max:255',
            'nip_kepala' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        Bidang::create($validated);

        return redirect()
            ->route('bidang.index')
            ->with('success', 'Bidang berhasil ditambahkan.');
    }

    /**
     * Show edit form
     */
    public function edit(Bidang $bidang): InertiaResponse
    {
        return Inertia::render('Bidang/Form', [
            'bidang' => $bidang,
        ]);
    }

    /**
     * Update bidang
     */
    public function update(Request $request, Bidang $bidang)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:10|unique:bidang,kode,' . $bidang->id,
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'kepala_bidang' => 'nullable|string|max:255',
            'nip_kepala' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        $bidang->update($validated);

        return redirect()
            ->route('bidang.index')
            ->with('success', 'Bidang berhasil diperbarui.');
    }

    /**
     * Delete bidang
     */
    public function destroy(Bidang $bidang)
    {
        // Check if bidang has related data
        if ($bidang->program()->exists() || $bidang->pelakuUsaha()->exists()) {
            return back()->with('error', 'Bidang tidak dapat dihapus karena masih memiliki program atau pelaku usaha terkait.');
        }

        $bidang->delete();

        return redirect()
            ->route('bidang.index')
            ->with('success', 'Bidang berhasil dihapus.');
    }
}
