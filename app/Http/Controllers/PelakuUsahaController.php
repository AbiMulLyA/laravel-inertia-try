<?php

namespace App\Http\Controllers;

use App\Models\PelakuUsaha;
use App\Services\PelakuUsahaService;
use App\Http\Requests\StorePelakuUsahaRequest;
use App\Http\Requests\UpdatePelakuUsahaRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\LazyCollection;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PelakuUsahaController extends Controller
{
    public function __construct(
        private PelakuUsahaService $pelakuUsahaService
    ) {
    }

    /**
     * Display listing dengan grouping per bidang
     */
    public function index(Request $request): InertiaResponse
    {
        $filters = $request->only([
            'bidang_id',
            'jenis_usaha',
            'kecamatan',
            'desa',
            'kelompok_tani',
            'search',
            'is_active',
            'sort_by',
            'sort_dir',
        ]);

        $perPage = $request->input('per_page', 50);
        $viewMode = $request->input('view_mode', 'table'); // table | grouped

        // Load data directly without defer
        $data = $viewMode === 'grouped'
            ? $this->pelakuUsahaService->getGroupedByBidang()
            : $this->pelakuUsahaService->getPaginated($filters, $perPage);

        return Inertia::render('PelakuUsaha/Index', [
            'filters' => $filters,
            'viewMode' => $viewMode,
            'filterOptions' => $this->pelakuUsahaService->getFilterOptions(),
            'data' => $data,
            'statistik' => $this->pelakuUsahaService->getStatistikPerBidang(),
        ]);
    }

    /**
     * Show create form
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('PelakuUsaha/Form', [
            'filterOptions' => $this->pelakuUsahaService->getFilterOptions(),
            'jenisUsaha' => PelakuUsaha::JENIS_USAHA,
        ]);
    }

    /**
     * Store new record
     */
    public function store(StorePelakuUsahaRequest $request)
    {
        $pelakuUsaha = PelakuUsaha::create($request->validated());

        // Clear cache
        $this->pelakuUsahaService->clearCache();

        return redirect()
            ->route('pelaku-usaha.index')
            ->with('success', 'Data pelaku usaha berhasil ditambahkan.');
    }

    /**
     * Show detail
     */
    public function show(PelakuUsaha $pelakuUsaha): InertiaResponse
    {
        $pelakuUsaha->load('bidang');

        return Inertia::render('PelakuUsaha/Show', [
            'pelakuUsaha' => $pelakuUsaha,
        ]);
    }

    /**
     * Show edit form
     */
    public function edit(PelakuUsaha $pelakuUsaha): InertiaResponse
    {
        return Inertia::render('PelakuUsaha/Form', [
            'pelakuUsaha' => $pelakuUsaha,
            'filterOptions' => $this->pelakuUsahaService->getFilterOptions(),
            'jenisUsaha' => PelakuUsaha::JENIS_USAHA,
        ]);
    }

    /**
     * Update record
     */
    public function update(UpdatePelakuUsahaRequest $request, PelakuUsaha $pelakuUsaha)
    {
        $pelakuUsaha->update($request->validated());

        // Clear cache
        $this->pelakuUsahaService->clearCache();

        return redirect()
            ->route('pelaku-usaha.index')
            ->with('success', 'Data pelaku usaha berhasil diperbarui.');
    }

    /**
     * Delete record
     */
    public function destroy(PelakuUsaha $pelakuUsaha)
    {
        $pelakuUsaha->delete();

        // Clear cache
        $this->pelakuUsahaService->clearCache();

        return redirect()
            ->route('pelaku-usaha.index')
            ->with('success', 'Data pelaku usaha berhasil dihapus.');
    }

    /**
     * Bulk delete
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:pelaku_usaha,id',
        ]);

        PelakuUsaha::whereIn('id', $request->ids)->delete();

        // Clear cache
        $this->pelakuUsahaService->clearCache();

        return back()->with('success', count($request->ids) . ' data berhasil dihapus.');
    }

    /**
     * Export to CSV dengan streaming (untuk data besar)
     */
    public function export(Request $request): StreamedResponse
    {
        $filters = $request->only(['bidang_id', 'jenis_usaha', 'kecamatan']);
        $filename = 'pelaku_usaha_' . now()->format('Y-m-d_His') . '.csv';

        return response()->streamDownload(function () use ($filters) {
            $handle = fopen('php://output', 'w');

            // BOM untuk Excel UTF-8
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            foreach ($this->pelakuUsahaService->exportToCsv($filters) as $row) {
                fputcsv($handle, $row);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Show import form
     */
    public function importForm(): InertiaResponse
    {
        return Inertia::render('PelakuUsaha/Import', [
            'filterOptions' => $this->pelakuUsahaService->getFilterOptions(),
        ]);
    }

    /**
     * Process import dari CSV/Excel
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx,xls|max:10240', // Max 10MB
            'bidang_id' => 'required|exists:bidang,id',
        ]);

        $file = $request->file('file');
        $bidangId = $request->input('bidang_id');

        // Baca file sebagai LazyCollection
        $data = LazyCollection::make(function () use ($file) {
            $handle = fopen($file->getPathname(), 'r');

            // Skip header
            $header = fgetcsv($handle);

            while (($row = fgetcsv($handle)) !== false) {
                yield array_combine($header, $row);
            }

            fclose($handle);
        });

        $stats = $this->pelakuUsahaService->bulkImport($data, $bidangId);

        return back()->with('import_result', $stats);
    }

    /**
     * Download template import
     */
    public function downloadTemplate(): StreamedResponse
    {
        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');

            // BOM untuk Excel UTF-8
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // Header
            fputcsv($handle, [
                'nik',
                'nama',
                'jenis_kelamin',
                'alamat',
                'kecamatan',
                'desa',
                'no_hp',
                'jenis_usaha',
                'luas_lahan',
                'jumlah_ternak',
                'kelompok_tani',
            ]);

            // Contoh data
            fputcsv($handle, [
                '3207012345678901',
                'John Doe',
                'L',
                'Jl. Contoh No. 123',
                'Kecamatan A',
                'Desa B',
                '081234567890',
                'petani_padi',
                '2.5',
                '',
                'Tani Makmur',
            ]);

            fclose($handle);
        }, 'template_import_pelaku_usaha.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Toggle status aktif
     */
    public function toggleStatus(PelakuUsaha $pelakuUsaha)
    {
        $pelakuUsaha->update([
            'is_active' => !$pelakuUsaha->is_active,
        ]);

        $this->pelakuUsahaService->clearCache();

        return back()->with('success', 'Status berhasil diubah.');
    }
}
