<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * DashboardService
 * 
 * Provides dashboard statistics and analytics.
 * Uses caching for better performance with large datasets.
 */
class DashboardService
{
    /**
     * Get overview statistics
     */
    public function getOverview(): array
    {
        return Cache::remember('dashboard_overview', 1800, function () {
            return [
                'total_categories' => Category::active()->count(),
                'total_projects' => Project::active()->count(),
                'total_tasks' => Task::count(),
                'total_budget' => Project::active()->sum('budget'),
                'total_spent' => Project::active()->sum('spent'),
                'tasks_in_progress' => Task::inProgress()->count(),
                'tasks_completed' => Task::completed()->count(),
            ];
        });
    }

    /**
     * Get statistics per category with detailed breakdown
     */
    public function getStatisticsPerCategory(int $year = null): Collection
    {
        $year = $year ?? now()->year;
        $cacheKey = "statistics_category_{$year}";

        return Cache::remember($cacheKey, 1800, function () use ($year) {
            return Category::active()
                ->withCount([
                    'projects as total_projects' => function ($query) use ($year) {
                        $query->where('year', $year);
                    },
                ])
                ->withSum([
                    'projects as total_budget' => function ($query) use ($year) {
                        $query->where('year', $year);
                    }
                ], 'budget')
                ->withSum([
                    'projects as total_spent' => function ($query) use ($year) {
                        $query->where('year', $year);
                    }
                ], 'spent')
                ->get()
                ->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'code' => $category->code,
                        'total_projects' => $category->total_projects ?? 0,
                        'total_budget' => $category->total_budget ?? 0,
                        'total_spent' => $category->total_spent ?? 0,
                        'spent_percentage' => $category->total_budget > 0
                            ? round(($category->total_spent / $category->total_budget) * 100, 2)
                            : 0,
                    ];
                });
        });
    }

    /**
     * Get task progress per category
     */
    public function getTaskProgress(): Collection
    {
        return Cache::remember('task_progress', 900, function () {
            return DB::table('tasks')
                ->join('projects', 'tasks.project_id', '=', 'projects.id')
                ->join('categories', 'projects.category_id', '=', 'categories.id')
                ->select(
                    'categories.id',
                    'categories.name',
                    DB::raw('COUNT(tasks.id) as total_tasks'),
                    DB::raw("SUM(CASE WHEN tasks.status = 'completed' THEN 1 ELSE 0 END) as completed"),
                    DB::raw("SUM(CASE WHEN tasks.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress"),
                    DB::raw("SUM(CASE WHEN tasks.status = 'pending' THEN 1 ELSE 0 END) as pending"),
                    DB::raw("SUM(CASE WHEN tasks.status = 'on_hold' THEN 1 ELSE 0 END) as on_hold"),
                    DB::raw('AVG(tasks.progress) as average_progress')
                )
                ->whereNull('tasks.deleted_at')
                ->groupBy('categories.id', 'categories.name')
                ->get();
        });
    }

    /**
     * Get task distribution by priority
     */
    public function getTasksByPriority(): Collection
    {
        return Cache::remember('tasks_by_priority', 1800, function () {
            return DB::table('tasks')
                ->select(
                    'priority',
                    DB::raw('COUNT(*) as total'),
                    DB::raw("SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed"),
                    DB::raw("SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress")
                )
                ->whereNull('deleted_at')
                ->groupBy('priority')
                ->orderByRaw("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END")
                ->get()
                ->map(function ($item) {
                    $item->priority_label = Task::PRIORITIES[$item->priority] ?? $item->priority;
                    return $item;
                });
        });
    }

    /**
     * Get recent activities
     */
    public function getRecentActivities(int $limit = 10): Collection
    {
        return Task::with(['project:id,name,category_id', 'project.category:id,name'])
            ->select('id', 'project_id', 'name', 'status', 'progress', 'updated_at')
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
        Cache::forget('task_progress');
        Cache::forget('tasks_by_priority');

        // Clear year-specific caches
        $currentYear = now()->year;
        for ($year = $currentYear - 5; $year <= $currentYear + 1; $year++) {
            Cache::forget("statistics_category_{$year}");
        }
    }
}
