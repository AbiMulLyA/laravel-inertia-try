<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bidang;
use App\Models\Kegiatan;
use App\Models\PelakuUsaha;
use App\Models\Program;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @group Statistik
 *
 * API untuk mendapatkan data statistik dan agregasi
 */
class StatistikApiController extends Controller
{
    /**
     * Get overall statistics for dashboard
     */
    public function index(): JsonResponse
    {
        $stats = [
            'total_bidang' => Bidang::count(),
            'total_bidang_aktif' => Bidang::where('is_active', true)->count(),
            'total_program' => Program::count(),
            'total_program_aktif' => Program::where('status', 'aktif')->count(),
            'total_kegiatan' => Kegiatan::count(),
            'total_kegiatan_berjalan' => Kegiatan::where('status', 'berjalan')->count(),
            'total_kegiatan_selesai' => Kegiatan::where('status', 'selesai')->count(),
            'total_pelaku_usaha' => PelakuUsaha::count(),
            'total_pelaku_usaha_aktif' => PelakuUsaha::where('is_active', true)->count(),

            // Anggaran statistics
            'total_pagu_anggaran' => Program::sum('pagu_anggaran'),
            'total_realisasi_anggaran' => Program::sum('realisasi_anggaran'),
            'persentase_realisasi' => $this->calculatePercentage(
                Program::sum('realisasi_anggaran'),
                Program::sum('pagu_anggaran')
            ),

            // Kegiatan progress
            'rata_rata_progress_kegiatan' => round(Kegiatan::avg('progress') ?? 0, 2),

            // Pelaku usaha by jenis
            'pelaku_usaha_by_jenis' => PelakuUsaha::select('jenis_usaha', DB::raw('count(*) as total'))
                ->groupBy('jenis_usaha')
                ->orderByDesc('total')
                ->get(),

            // Recent activities
            'kegiatan_terbaru' => Kegiatan::with('program.bidang')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($k) => [
                    'id' => $k->id,
                    'nama' => $k->nama,
                    'status' => $k->status,
                    'progress' => $k->progress,
                    'bidang' => $k->program?->bidang?->nama,
                ]),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Statistik berhasil diambil',
            'data' => $stats,
        ]);
    }

    /**
     * Get statistics grouped by bidang
     */
    public function byBidang(): JsonResponse
    {
        $stats = Bidang::withCount(['program', 'pelakuUsaha'])
            ->with([
                'program' => function ($query) {
                    $query->select('id', 'bidang_id', 'pagu_anggaran', 'realisasi_anggaran', 'status');
                }
            ])
            ->get()
            ->map(function ($bidang) {
                $paguTotal = $bidang->program->sum('pagu_anggaran');
                $realisasiTotal = $bidang->program->sum('realisasi_anggaran');

                return [
                    'id' => $bidang->id,
                    'kode' => $bidang->kode,
                    'nama' => $bidang->nama,
                    'is_active' => $bidang->is_active,
                    'total_program' => $bidang->program_count,
                    'total_pelaku_usaha' => $bidang->pelaku_usaha_count,
                    'total_program_aktif' => $bidang->program->where('status', 'aktif')->count(),
                    'pagu_anggaran' => $paguTotal,
                    'realisasi_anggaran' => $realisasiTotal,
                    'persentase_realisasi' => $this->calculatePercentage($realisasiTotal, $paguTotal),
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Statistik per bidang berhasil diambil',
            'data' => $stats,
        ]);
    }

    /**
     * Get statistics grouped by kecamatan
     */
    public function byKecamatan(): JsonResponse
    {
        // Pelaku usaha by kecamatan
        $pelakuUsahaByKecamatan = PelakuUsaha::select(
            'kecamatan',
            DB::raw('count(*) as total_pelaku_usaha'),
            DB::raw('count(case when is_active = true then 1 end) as total_aktif')
        )
            ->whereNotNull('kecamatan')
            ->groupBy('kecamatan')
            ->orderByDesc('total_pelaku_usaha')
            ->get();

        // Kegiatan by kecamatan
        $kegiatanByKecamatan = Kegiatan::select(
            'kecamatan',
            DB::raw('count(*) as total_kegiatan'),
            DB::raw('avg(progress) as rata_rata_progress'),
            DB::raw('sum(anggaran) as total_anggaran'),
            DB::raw('sum(realisasi_anggaran) as total_realisasi')
        )
            ->whereNotNull('kecamatan')
            ->groupBy('kecamatan')
            ->orderByDesc('total_kegiatan')
            ->get()
            ->map(fn($item) => [
                'kecamatan' => $item->kecamatan,
                'total_kegiatan' => $item->total_kegiatan,
                'rata_rata_progress' => round($item->rata_rata_progress ?? 0, 2),
                'total_anggaran' => $item->total_anggaran,
                'total_realisasi' => $item->total_realisasi,
                'persentase_realisasi' => $this->calculatePercentage($item->total_realisasi, $item->total_anggaran),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Statistik per kecamatan berhasil diambil',
            'data' => [
                'pelaku_usaha' => $pelakuUsahaByKecamatan,
                'kegiatan' => $kegiatanByKecamatan,
            ],
        ]);
    }

    /**
     * Calculate percentage safely
     */
    private function calculatePercentage($value, $total): float
    {
        if ($total == 0) {
            return 0;
        }
        return round(($value / $total) * 100, 2);
    }
}
