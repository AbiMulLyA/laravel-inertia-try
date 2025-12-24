<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * DashboardController
 * 
 * Dashboard with overview statistics and analytics.
 */
class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {
    }

    public function index(Request $request): Response
    {
        $year = $request->input('year', now()->year);

        return Inertia::render('Dashboard', [
            'overview' => $this->dashboardService->getOverview(),
            'statisticsCategory' => $this->dashboardService->getStatisticsPerCategory($year),
            'taskProgress' => $this->dashboardService->getTaskProgress(),
            'tasksByPriority' => $this->dashboardService->getTasksByPriority(),
            'recentActivities' => $this->dashboardService->getRecentActivities(),
            'year' => $year,
            'yearOptions' => range(now()->year - 5, now()->year + 1),
        ]);
    }
}
