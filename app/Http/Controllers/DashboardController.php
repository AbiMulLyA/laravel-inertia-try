<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function index(Request $request): Response
    {
        $tahun = $request->input('tahun', now()->year);

        return Inertia::render('Dashboard', [
            'overview' => $this->dashboardService->getOverview(),
            'statistikBidang' => $this->dashboardService->getStatistikPerBidang($tahun),
            'progressKegiatan' => $this->dashboardService->getProgressKegiatan(),
            'distribusiPelakuUsaha' => $this->dashboardService->getDistribusiPelakuUsaha(),
            'distribusiKecamatan' => $this->dashboardService->getDistribusiPerKecamatan(),
            'recentActivities' => $this->dashboardService->getRecentActivities(),
            'tahun' => $tahun,
            'tahunOptions' => range(now()->year - 5, now()->year + 1),
        ]);
    }
}
