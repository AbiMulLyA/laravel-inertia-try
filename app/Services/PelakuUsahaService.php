<?php

namespace App\Services;

use App\Models\PelakuUsaha;
use App\Models\Bidang;
use Illuminate\Support\Collection;
use Illuminate\Support\LazyCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class PelakuUsahaService
{
    /**
     * Get paginated data dengan filtering
     * Optimized untuk data besar dengan cursor pagination
     */
    public function getPaginated(array $filters = [], int $perPage = 50): LengthAwarePaginator
    {
        $query = PelakuUsaha::query()
            ->with('bidang:id,nama,kode') // Eager load hanya kolom yang dibutuhkan
            ->listView(); // Gunakan scope untuk select minimal

        // Apply filters
        if (!empty($filters['bidang_id'])) {
            $query->byBidang($filters['bidang_id']);
        }

        if (!empty($filters['jenis_usaha'])) {
            $query->byJenisUsaha($filters['jenis_usaha']);
        }

        if (!empty($filters['kecamatan'])) {
            $query->byKecamatan($filters['kecamatan']);
        }

        if (!empty($filters['desa'])) {
            $query->byDesa($filters['desa']);
        }

        if (!empty($filters['kelompok_tani'])) {
            $query->byKelompokTani($filters['kelompok_tani']);
        }

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'nama';
        $sortDir = $filters['sort_dir'] ?? 'asc';
        $query->orderBy($sortBy, $sortDir);

        return $query->paginate($perPage);
    }

    /**
     * Get data grouped by bidang
     * Dengan caching untuk performa
     */
    public function getGroupedByBidang(): Collection
    {
        return Cache::remember('pelaku_usaha_by_bidang', 3600, function () {
            return Bidang::with(['pelakuUsaha' => function ($query) {
                $query->listView()->active()->orderBy('nama');
            }])
            ->active()
            ->get()
            ->map(function ($bidang) {
                return [
                    'id' => $bidang->id,
                    'nama' => $bidang->nama,
                    'kode' => $bidang->kode,
                    'total' => $bidang->pelakuUsaha->count(),
                    'pelaku_usaha' => $bidang->pelakuUsaha,
                ];
            });
        });
    }

    /**
     * Get statistik per bidang
     * Optimized dengan raw query untuk performa
     */
    public function getStatistikPerBidang(): Collection
    {
        return Cache::remember('statistik_per_bidang', 3600, function () {
            return DB::table('pelaku_usaha')
                ->join('bidang', 'pelaku_usaha.bidang_id', '=', 'bidang.id')
                ->select(
                    'bidang.id',
                    'bidang.nama',
                    'bidang.kode',
                    DB::raw('COUNT(pelaku_usaha.id) as total_pelaku'),
                    DB::raw('SUM(CASE WHEN pelaku_usaha.is_active = true THEN 1 ELSE 0 END) as total_aktif'),
                    DB::raw('SUM(COALESCE(pelaku_usaha.luas_lahan, 0)) as total_luas_lahan'),
                    DB::raw('SUM(COALESCE(pelaku_usaha.jumlah_ternak, 0)) as total_ternak')
                )
                ->whereNull('pelaku_usaha.deleted_at')
                ->groupBy('bidang.id', 'bidang.nama', 'bidang.kode')
                ->get();
        });
    }

    /**
     * Export data menggunakan Lazy Collection
     * Untuk handle ratusan ribu data tanpa memory issue
     */
    public function exportToCsv(array $filters = []): \Generator
    {
        $query = PelakuUsaha::query()
            ->with('bidang:id,nama')
            ->when(!empty($filters['bidang_id']), fn($q) => $q->byBidang($filters['bidang_id']))
            ->when(!empty($filters['jenis_usaha']), fn($q) => $q->byJenisUsaha($filters['jenis_usaha']))
            ->when(!empty($filters['kecamatan']), fn($q) => $q->byKecamatan($filters['kecamatan']))
            ->orderBy('bidang_id')
            ->orderBy('nama');

        // Yield header
        yield ['NIK', 'Nama', 'Bidang', 'Jenis Usaha', 'Kecamatan', 'Desa', 'Kelompok Tani', 'Luas Lahan', 'Jumlah Ternak'];

        // Gunakan cursor untuk streaming data
        foreach ($query->cursor() as $pelaku) {
            yield [
                $pelaku->nik,
                $pelaku->nama,
                $pelaku->bidang?->nama ?? '-',
                $pelaku->jenis_usaha_label,
                $pelaku->kecamatan,
                $pelaku->desa,
                $pelaku->kelompok_tani ?? '-',
                $pelaku->luas_lahan ?? 0,
                $pelaku->jumlah_ternak ?? 0,
            ];
        }
    }

    /**
     * Bulk import menggunakan chunk
     * Untuk import ribuan data sekaligus
     */
    public function bulkImport(LazyCollection $data, int $bidangId): array
    {
        $stats = [
            'total' => 0,
            'success' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        // Process dalam chunks of 500
        $data->chunk(500)->each(function ($chunk) use ($bidangId, &$stats) {
            $records = [];
            $now = now();

            foreach ($chunk as $index => $row) {
                $stats['total']++;

                try {
                    // Validasi NIK unik
                    if (PelakuUsaha::where('nik', $row['nik'])->exists()) {
                        $stats['failed']++;
                        $stats['errors'][] = "Baris {$index}: NIK {$row['nik']} sudah terdaftar";
                        continue;
                    }

                    $records[] = [
                        'bidang_id' => $bidangId,
                        'nik' => $row['nik'],
                        'nama' => $row['nama'],
                        'jenis_kelamin' => $row['jenis_kelamin'] ?? 'L',
                        'alamat' => $row['alamat'],
                        'kecamatan' => $row['kecamatan'],
                        'desa' => $row['desa'],
                        'no_hp' => $row['no_hp'] ?? null,
                        'jenis_usaha' => $row['jenis_usaha'] ?? 'lainnya',
                        'luas_lahan' => $row['luas_lahan'] ?? null,
                        'jumlah_ternak' => $row['jumlah_ternak'] ?? null,
                        'kelompok_tani' => $row['kelompok_tani'] ?? null,
                        'is_active' => true,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                    $stats['success']++;
                } catch (\Exception $e) {
                    $stats['failed']++;
                    $stats['errors'][] = "Baris {$index}: {$e->getMessage()}";
                }
            }

            // Bulk insert
            if (!empty($records)) {
                DB::table('pelaku_usaha')->insert($records);
            }
        });

        // Clear cache setelah import
        $this->clearCache();

        return $stats;
    }

    /**
     * Get filter options (untuk dropdown)
     */
    public function getFilterOptions(): array
    {
        return Cache::remember('pelaku_usaha_filter_options', 3600, function () {
            return [
                'bidang' => Bidang::active()
                    ->select('id', 'nama', 'kode')
                    ->orderBy('nama')
                    ->get(),
                    
                'kecamatan' => PelakuUsaha::select('kecamatan')
                    ->distinct()
                    ->whereNotNull('kecamatan')
                    ->orderBy('kecamatan')
                    ->pluck('kecamatan'),
                    
                'jenis_usaha' => collect(PelakuUsaha::JENIS_USAHA)
                    ->map(fn($label, $value) => ['value' => $value, 'label' => $label]),
                    
                'kelompok_tani' => PelakuUsaha::select('kelompok_tani')
                    ->distinct()
                    ->whereNotNull('kelompok_tani')
                    ->orderBy('kelompok_tani')
                    ->pluck('kelompok_tani'),
            ];
        });
    }

    /**
     * Clear all related cache
     */
    public function clearCache(): void
    {
        Cache::forget('pelaku_usaha_by_bidang');
        Cache::forget('statistik_per_bidang');
        Cache::forget('pelaku_usaha_filter_options');
    }
}
