<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * TaskController
 * 
 * Example controller for full CRUD with progress tracking.
 * Demonstrates: filtering, pagination, status management, progress updates.
 */
class TaskController extends Controller
{
    /**
     * Display listing of tasks
     */
    public function index(Request $request): InertiaResponse
    {
        $projectId = $request->input('project_id');
        $status = $request->input('status');
        $priority = $request->input('priority');
        $search = $request->input('search');

        $query = Task::with(['project:id,code,name', 'project.category:id,code,name']);

        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($priority) {
            $query->where('priority', $priority);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        $tasks = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'code' => $item->code,
                    'name' => $item->name,
                    'project' => $item->project,
                    'location' => $item->location,
                    'target' => $item->target,
                    'achieved' => $item->achieved,
                    'unit' => $item->unit,
                    'budget' => $item->budget,
                    'spent' => $item->spent,
                    'status' => $item->status,
                    'status_label' => $item->status_label,
                    'progress' => $item->progress,
                    'priority' => $item->priority,
                    'priority_label' => $item->priority_label,
                    'achieved_percentage' => $item->achieved_percentage,
                    'start_date' => $item->start_date?->format('Y-m-d'),
                    'end_date' => $item->end_date?->format('Y-m-d'),
                ];
            });

        $projects = Project::with('category:id,code,name')
            ->select('id', 'category_id', 'code', 'name')
            ->orderBy('name')
            ->get();

        // Summary statistics
        $summary = [
            'total' => Task::count(),
            'in_progress' => Task::where('status', 'in_progress')->count(),
            'completed' => Task::where('status', 'completed')->count(),
            'pending' => Task::where('status', 'pending')->count(),
        ];

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'projects' => $projects,
            'filters' => [
                'project_id' => $projectId,
                'status' => $status,
                'priority' => $priority,
                'search' => $search,
            ],
            'summary' => $summary,
            'statuses' => Task::STATUSES,
            'priorities' => Task::PRIORITIES,
        ]);
    }

    /**
     * Show create form
     */
    public function create(): InertiaResponse
    {
        $projects = Project::with('category:id,code,name')
            ->select('id', 'category_id', 'code', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Tasks/Form', [
            'projects' => $projects,
            'statuses' => Task::STATUSES,
            'priorities' => Task::PRIORITIES,
        ]);
    }

    /**
     * Store new task
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'code' => 'required|string|max:30|unique:tasks,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'target' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'budget' => 'required|numeric|min:0',
            'status' => 'required|in:pending,in_progress,completed,on_hold',
            'priority' => 'required|in:low,medium,high',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        Task::create($validated);

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task created successfully.');
    }

    /**
     * Show task detail
     */
    public function show(Task $task): InertiaResponse
    {
        $task->load(['project.category']);

        return Inertia::render('Tasks/Show', [
            'task' => $task,
        ]);
    }

    /**
     * Show edit form
     */
    public function edit(Task $task): InertiaResponse
    {
        $projects = Project::with('category:id,code,name')
            ->select('id', 'category_id', 'code', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Tasks/Form', [
            'task' => $task,
            'projects' => $projects,
            'statuses' => Task::STATUSES,
            'priorities' => Task::PRIORITIES,
        ]);
    }

    /**
     * Update task
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'code' => 'required|string|max:30|unique:tasks,code,' . $task->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'target' => 'required|numeric|min:0',
            'achieved' => 'nullable|numeric|min:0',
            'unit' => 'required|string|max:50',
            'budget' => 'required|numeric|min:0',
            'spent' => 'nullable|numeric|min:0',
            'status' => 'required|in:pending,in_progress,completed,on_hold',
            'progress' => 'nullable|integer|min:0|max:100',
            'priority' => 'required|in:low,medium,high',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
        ]);

        $task->update($validated);

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Delete task
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()
            ->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }

    /**
     * Update progress
     */
    public function updateProgress(Request $request, Task $task)
    {
        $validated = $request->validate([
            'progress' => 'required|integer|min:0|max:100',
            'achieved' => 'nullable|numeric|min:0',
            'spent' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $task->update($validated);

        return back()->with('success', 'Task progress updated successfully.');
    }
}
