<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Tasks
 *
 * API untuk manajemen tugas/kegiatan
 */
class TaskApiController extends Controller
{
    /**
     * Get all tasks with pagination
     *
     * @authenticated
     *
     * @queryParam page int Page number. Example: 1
     * @queryParam per_page int Items per page. Example: 20
     * @queryParam project_id int Filter by project ID. Example: 1
     * @queryParam status string Filter by status (pending, in_progress, completed, on_hold). Example: in_progress
     * @queryParam priority string Filter by priority (low, medium, high). Example: high
     * @queryParam search string Search by name, code or location. Example: task
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
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
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('code', 'ilike', "%{$search}%")
                    ->orWhere('location', 'ilike', "%{$search}%");
            });
        }

        $tasks = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $tasks->items(),
            'meta' => [
                'current_page' => $tasks->currentPage(),
                'per_page' => $tasks->perPage(),
                'total' => $tasks->total(),
                'last_page' => $tasks->lastPage(),
            ],
        ]);
    }

    /**
     * Get single task
     *
     * @authenticated
     *
     * @urlParam task int required The task ID. Example: 1
     */
    public function show(Task $task): JsonResponse
    {
        $task->load(['project.category']);

        return response()->json([
            'success' => true,
            'data' => $task,
        ]);
    }

    /**
     * Create new task
     *
     * @authenticated
     */
    public function store(Request $request): JsonResponse
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

        $task = Task::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully',
            'data' => $task->load('project:id,code,name'),
        ], 201);
    }

    /**
     * Update task
     *
     * @authenticated
     *
     * @urlParam task int required The task ID. Example: 1
     */
    public function update(Request $request, Task $task): JsonResponse
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

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data' => $task->load('project:id,code,name'),
        ]);
    }

    /**
     * Delete task
     *
     * @authenticated
     *
     * @urlParam task int required The task ID. Example: 1
     */
    public function destroy(Task $task): JsonResponse
    {
        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully',
        ]);
    }

    /**
     * Update task progress
     *
     * @authenticated
     *
     * @urlParam task int required The task ID. Example: 1
     * @bodyParam progress int required Progress percentage (0-100). Example: 75
     * @bodyParam achieved numeric optional Achieved amount. Example: 50
     * @bodyParam spent numeric optional Amount spent. Example: 1000000
     * @bodyParam notes string optional Progress notes. Example: Task is 75% complete
     */
    public function updateProgress(Request $request, Task $task): JsonResponse
    {
        $validated = $request->validate([
            'progress' => 'required|integer|min:0|max:100',
            'achieved' => 'nullable|numeric|min:0',
            'spent' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $task->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Task progress updated successfully',
            'data' => $task,
        ]);
    }

    /**
     * Get task summary statistics
     *
     * @authenticated
     */
    public function summary(): JsonResponse
    {
        $summary = [
            'total' => Task::count(),
            'in_progress' => Task::where('status', 'in_progress')->count(),
            'completed' => Task::where('status', 'completed')->count(),
            'pending' => Task::where('status', 'pending')->count(),
            'on_hold' => Task::where('status', 'on_hold')->count(),
            'high_priority' => Task::where('priority', 'high')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }
}
