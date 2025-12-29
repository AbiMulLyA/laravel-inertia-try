<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Budget Report
     * Shows budget overview and breakdown by category.
     */
    public function budget(Request $request)
    {
        $year = $request->get('year', date('Y'));

        // Get categories with budget data
        $categories = Category::withCount([
            'projects' => function ($q) use ($year) {
                $q->where('year', $year);
            }
        ])
            ->get()
            ->map(function ($category) use ($year) {
                $projects = $category->projects()->where('year', $year)->get();
                $budget = $projects->sum('budget');
                $spent = $projects->sum('spent');
                $remaining = $budget - $spent;
                $percentage = $budget > 0 ? ($spent / $budget) * 100 : 0;

                return [
                    'id' => $category->id,
                    'code' => $category->code,
                    'name' => $category->name,
                    'budget' => $budget,
                    'spent' => $spent,
                    'remaining' => $remaining,
                    'percentage' => round($percentage, 1),
                ];
            })
            ->filter(fn($c) => $c['budget'] > 0)
            ->values();

        // Calculate summary
        $totalBudget = $categories->sum('budget');
        $totalSpent = $categories->sum('spent');
        $totalRemaining = $totalBudget - $totalSpent;
        $spentPercentage = $totalBudget > 0 ? ($totalSpent / $totalBudget) * 100 : 0;

        return Inertia::render('Reports/Budget', [
            'summary' => [
                'total_budget' => $totalBudget,
                'total_spent' => $totalSpent,
                'total_remaining' => $totalRemaining,
                'spent_percentage' => round($spentPercentage, 1),
            ],
            'categories' => $categories,
            'year' => (int) $year,
            'yearOptions' => range(date('Y') - 5, date('Y') + 1),
        ]);
    }

    /**
     * Spending Report
     * Shows spending overview and recent transactions.
     */
    public function spending(Request $request)
    {
        $year = $request->get('year', date('Y'));

        // Get all tasks with spending data for the year
        $tasks = Task::with(['project.category'])
            ->whereHas('project', function ($q) use ($year) {
                $q->where('year', $year);
            })
            ->where('spent', '>', 0)
            ->orderBy('updated_at', 'desc')
            ->get();

        // Calculate summary
        $totalSpent = $tasks->sum('spent');
        $thisMonth = $tasks->filter(function ($task) {
            return $task->updated_at->month === now()->month;
        })->sum('spent');

        // Monthly data (simulated from tasks)
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $monthlyData = collect($months)->map(function ($month, $index) use ($tasks) {
            $amount = $tasks->filter(function ($task) use ($index) {
                return $task->updated_at->month === $index + 1;
            })->sum('spent');

            return [
                'month' => $month,
                'amount' => $amount,
            ];
        })->take(now()->month);

        // Recent spending items
        $recentSpending = $tasks->take(20)->map(function ($task) {
            return [
                'id' => $task->id,
                'name' => $task->name,
                'project_name' => $task->project?->name ?? '-',
                'category_code' => $task->project?->category?->code ?? '-',
                'amount' => $task->spent,
                'date' => $task->updated_at->format('Y-m-d'),
                'type' => 'expense',
            ];
        });

        return Inertia::render('Reports/Spending', [
            'summary' => [
                'total_spent' => $totalSpent,
                'this_month' => $thisMonth,
                'avg_monthly' => $monthlyData->count() > 0 ? round($totalSpent / $monthlyData->count()) : 0,
                'transaction_count' => $tasks->count(),
            ],
            'recent_spending' => $recentSpending,
            'monthly_data' => $monthlyData->values(),
            'year' => (int) $year,
        ]);
    }

    /**
     * Project Progress Report
     */
    public function projectProgress(Request $request)
    {
        $year = $request->get('year', date('Y'));

        $projects = Project::with(['category', 'tasks'])
            ->where('year', $year)
            ->get()
            ->map(function ($project) {
                $tasksTotal = $project->tasks->count();
                $tasksCompleted = $project->tasks->where('status', 'completed')->count();
                $progress = $tasksTotal > 0 ? round(($tasksCompleted / $tasksTotal) * 100) : 0;

                return [
                    'id' => $project->id,
                    'code' => $project->code,
                    'name' => $project->name,
                    'category_name' => $project->category?->name ?? '-',
                    'progress' => $progress,
                    'status' => $project->status,
                    'status_label' => $project->status_label,
                    'tasks_total' => $tasksTotal,
                    'tasks_completed' => $tasksCompleted,
                    'budget' => $project->budget,
                    'spent' => $project->spent,
                ];
            });

        $summary = [
            'total' => $projects->count(),
            'on_track' => $projects->where('progress', '>=', 50)->count(),
            'at_risk' => $projects->where('progress', '<', 30)->where('status', '!=', 'completed')->count(),
            'completed' => $projects->where('status', 'completed')->count(),
        ];

        return Inertia::render('Reports/ProjectProgress', [
            'summary' => $summary,
            'projects' => $projects->values(),
            'year' => (int) $year,
        ]);
    }

    /**
     * Task Progress Report
     */
    public function taskProgress(Request $request)
    {
        $year = $request->get('year', date('Y'));

        $tasks = Task::with(['project.category'])
            ->whereHas('project', function ($q) use ($year) {
                $q->where('year', $year);
            })
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'code' => $task->code,
                    'name' => $task->name,
                    'project_name' => $task->project?->name ?? '-',
                    'progress' => $task->progress,
                    'status' => $task->status,
                    'status_label' => $task->status_label,
                    'priority' => $task->priority,
                    'priority_label' => $task->priority_label,
                    'target' => $task->target,
                    'achieved' => $task->achieved,
                    'unit' => $task->unit,
                ];
            });

        $summary = [
            'total' => $tasks->count(),
            'in_progress' => $tasks->where('status', 'in_progress')->count(),
            'completed' => $tasks->where('status', 'completed')->count(),
            'pending' => $tasks->where('status', 'pending')->count(),
        ];

        return Inertia::render('Reports/TaskProgress', [
            'summary' => $summary,
            'tasks' => $tasks->values(),
            'year' => (int) $year,
        ]);
    }
}
