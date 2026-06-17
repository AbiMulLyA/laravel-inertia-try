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
    ) {}

    public function index(Request $request): Response
    {
        $year = $request->input('year', now()->year);

        return Inertia::render('Dashboard', [
            // Lightweight data - sync (page shell)
            'year' => $year,
            'yearOptions' => range(now()->year - 5, now()->year + 1),

            // Heavy data - deferred (loaded after page render)
            'overview' => Inertia::defer(fn () => $this->dashboardService->getOverview()),
            'statisticsCategory' => Inertia::defer(fn () => $this->dashboardService->getStatisticsPerCategory($year)),
            'taskProgress' => Inertia::defer(fn () => $this->dashboardService->getTaskProgress()),
            'tasksByPriority' => Inertia::defer(fn () => $this->dashboardService->getTasksByPriority()),
            'recentActivities' => Inertia::defer(fn () => $this->dashboardService->getRecentActivities()),
        ]);
    }
}
