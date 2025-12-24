<?php

namespace App\Services;

use App\Models\Bidang;
use App\Models\Program;
use App\Models\Kegiatan;
use App\Models\PelakuUsaha;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Get overview statistics
     */
    public function getOverview(): array
    {
        return Cache::remember('dashboard_overview', 1800, function () {
            return [
                'total_bidang' => Bidang::active()->count(),
                'total_program' => Program::aktif()->count(),
                'total_kegiatan' => Kegiatan::count(),
                'total_pelaku_usaha' => PelakuUsaha::active()->count(),
                'total_anggaran' => Program::aktif()->sum('pagu_anggaran'),
                'total_realisasi' => Program::aktif()->sum('realisasi_anggaran'),
                'kegiatan_berjalan' => Kegiatan::berjalan()->count(),
                'kegiatan_selesai' => Kegiatan::status('selesai')->count(),
            ];
        });
    }

    /**
     * Get statistics per bidang dengan detail
     */
    public function getStatistikPerBidang(int $tahun = null): Collection
    {
        $tahun = $tahun ?? now()->year;
        $cacheKey = "statistik_bidang_{$tahun}";

        return Cache::remember($cacheKey, 1800, function () use ($tahun) {
            return Bidang::active()
                ->withCount([
                    'program as total_program' => function ($query) use ($tahun) {
                        $query->where('tahun_anggaran', $tahun);
                    },
                    'pelakuUsaha as total_pelaku_usaha' => function ($query) {
                        $query->where('is_active', true);
                    },
                ])
                ->withSum(['program as total_anggaran' => function ($query) use ($tahun) {
                    $query->where('tahun_anggaran', $tahun);
                }], 'pagu_anggaran')
                ->withSum(['program as total_realisasi' => function ($query) use ($tahun) {
                    $query->where('tahun_anggaran', $tahun);
                }], 'realisasi_anggaran')
                ->get()
                ->map(function ($bidang) {
                    return [
                        'id' => $bidang->id,
                        'nama' => $bidang->nama,
                        'kode' => $bidang->kode,
                        'total_program' => $bidang->total_program ?? 0,
                        'total_pelaku_usaha' => $bidang->total_pelaku_usaha ?? 0,
                        'total_anggaran' => $bidang->total_anggaran ?? 0,
                        'total_realisasi' => $bidang->total_realisasi ?? 0,
                        'persentase_realisasi' => $bidang->total_anggaran > 0 
                            ? round(($bidang->total_realisasi / $bidang->total_anggaran) * 100, 2) 
                            : 0,
                    ];
                });
        });
    }

    /**
     * Get progress kegiatan per bidang
     */
    public function getProgressKegiatan(): Collection
    {
        return Cache::remember('progress_kegiatan', 900, function () {
            return DB::table('kegiatan')
                ->join('program', 'kegiatan.program_id', '=', 'program.id')
                ->join('bidang', 'program.bidang_id', '=', 'bidang.id')
                ->select(
                    'bidang.id',
                    'bidang.nama',
                    DB::raw('COUNT(kegiatan.id) as total_kegiatan'),
                    DB::raw("SUM(CASE WHEN kegiatan.status = 'selesai' THEN 1 ELSE 0 END) as selesai"),
                    DB::raw("SUM(CASE WHEN kegiatan.status = 'berjalan' THEN 1 ELSE 0 END) as berjalan"),
                    DB::raw("SUM(CASE WHEN kegiatan.status = 'belum_mulai' THEN 1 ELSE 0 END) as belum_mulai"),
                    DB::raw("SUM(CASE WHEN kegiatan.status = 'tertunda' THEN 1 ELSE 0 END) as tertunda"),
                    DB::raw('AVG(kegiatan.progress) as rata_rata_progress')
                )
                ->whereNull('kegiatan.deleted_at')
                ->groupBy('bidang.id', 'bidang.nama')
                ->get();
        });
    }

    /**
     * Get distribusi pelaku usaha per jenis usaha
     */
    public function getDistribusiPelakuUsaha(): Collection
    {
        return Cache::remember('distribusi_pelaku_usaha', 1800, function () {
            return DB::table('pelaku_usaha')
                ->select(
                    'jenis_usaha',
                    DB::raw('COUNT(*) as total'),
                    DB::raw('SUM(COALESCE(luas_lahan, 0)) as total_luas_lahan'),
                    DB::raw('SUM(COALESCE(jumlah_ternak, 0)) as total_ternak')
                )
                ->where('is_active', true)
                ->whereNull('deleted_at')
                ->groupBy('jenis_usaha')
                ->orderByDesc('total')
                ->get()
                ->map(function ($item) {
                    $item->jenis_usaha_label = PelakuUsaha::JENIS_USAHA[$item->jenis_usaha] ?? $item->jenis_usaha;
                    return $item;
                });
        });
    }

    /**
     * Get distribusi per kecamatan
     */
    public function getDistribusiPerKecamatan(): Collection
    {
        return Cache::remember('distribusi_kecamatan', 1800, function () {
            return DB::table('pelaku_usaha')
                ->select(
                    'kecamatan',
                    DB::raw('COUNT(*) as total'),
                    DB::raw('COUNT(DISTINCT desa) as total_desa'),
                    DB::raw('COUNT(DISTINCT kelompok_tani) as total_kelompok')
                )
                ->where('is_active', true)
                ->whereNull('deleted_at')
                ->groupBy('kecamatan')
                ->orderBy('kecamatan')
                ->get();
        });
    }

    /**
     * Get recent activities
     */
    public function getRecentActivities(int $limit = 10): Collection
    {
        return Kegiatan::with(['program:id,nama,bidang_id', 'program.bidang:id,nama'])
            ->select('id', 'program_id', 'nama', 'status', 'progress', 'updated_at')
            ->orderByDesc('updated_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Clear all dashboard cache
     */
    public function clearCache(): void
    {
        Cache::forget('dashboard_overview');
        Cache::forget('progress_kegiatan');
        Cache::forget('distribusi_pelaku_usaha');
        Cache::forget('distribusi_kecamatan');
        
        // Clear year-specific caches
        $currentYear = now()->year;
        for ($year = $currentYear - 5; $year <= $currentYear + 1; $year++) {
            Cache::forget("statistik_bidang_{$year}");
        }
    }
}
