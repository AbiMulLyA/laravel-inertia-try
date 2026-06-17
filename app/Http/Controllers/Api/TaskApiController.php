<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
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
    use ApiResponse;

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
     *
     * @response 200 scenario="success" {"code": 200, "message": "Tasks retrieved successfully", "data": [{"id": 1, "code": "TSK001", "name": "Task 1", "status": "in_progress", "priority": "high", "project": {"id": 1, "code": "PRJ001", "name": "Project 1"}}], "meta": {"current_page": 1, "per_page": 20, "total": 100, "last_page": 5}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
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

        return $this->paginatedResponse($tasks, 'Tasks retrieved successfully');
    }

    /**
     * Get single task
     *
     * @authenticated
     *
     * @urlParam task int required The task ID. Example: 1
     *
     * @response 200 scenario="success" {"code": 200, "message": "Task retrieved successfully", "data": {"id": 1, "code": "TSK001", "name": "Task 1", "status": "in_progress", "priority": "high", "progress": 50, "project": {"id": 1, "code": "PRJ001", "name": "Project 1", "category": {"id": 1, "code": "CAT001", "name": "Category 1"}}}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Task not found"}
     */
    public function show(Task $task): JsonResponse
    {
        $task->load(['project.category']);

        return $this->successResponse($task, 'Task retrieved successfully');
    }

    /**
     * Create new task
     *
     * @authenticated
     *
     * @bodyParam project_id int required Project ID. Example: 1
     * @bodyParam code string required Task code, max 30 chars, unique. Example: TSK001
     * @bodyParam name string required Task name, max 255 chars. Example: Build Foundation
     * @bodyParam description string optional Description. Example: Task description
     * @bodyParam location string optional Location. Example: Site A
     * @bodyParam target numeric required Target amount. Example: 100
     * @bodyParam unit string required Unit of measurement. Example: m2
     * @bodyParam budget numeric required Budget amount. Example: 50000000
     * @bodyParam status string required Status (pending, in_progress, completed, on_hold). Example: pending
     * @bodyParam priority string required Priority (low, medium, high). Example: high
     * @bodyParam start_date date optional Start date. Example: 2024-01-01
     * @bodyParam end_date date optional End date. Example: 2024-03-31
     *
     * @response 201 scenario="success" {"code": 201, "message": "Task created successfully", "data": {"id": 1, "code": "TSK001", "name": "Build Foundation", "status": "pending", "priority": "high", "project": {"id": 1, "code": "PRJ001", "name": "Project 1"}}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 422 scenario="validation error" {"code": 422, "message": "Validation error", "errors": {"code": ["The code has already been taken."]}}
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

        return $this->createdResponse($task->load('project:id,code,name'), 'Task created successfully');
    }

    /**
     * Update task
     *
     * @authenticated
     *
     * @urlParam task int required The task ID. Example: 1
     *
     * @bodyParam project_id int required Project ID. Example: 1
     * @bodyParam code string required Task code, max 30 chars, unique. Example: TSK001
     * @bodyParam name string required Task name, max 255 chars. Example: Build Foundation
     * @bodyParam description string optional Description. Example: Task description
     * @bodyParam location string optional Location. Example: Site A
     * @bodyParam target numeric required Target amount. Example: 100
     * @bodyParam achieved numeric optional Achieved amount. Example: 50
     * @bodyParam unit string required Unit of measurement. Example: m2
     * @bodyParam budget numeric required Budget amount. Example: 50000000
     * @bodyParam spent numeric optional Amount spent. Example: 25000000
     * @bodyParam status string required Status (pending, in_progress, completed, on_hold). Example: in_progress
     * @bodyParam progress int optional Progress percentage (0-100). Example: 50
     * @bodyParam priority string required Priority (low, medium, high). Example: high
     * @bodyParam start_date date optional Start date. Example: 2024-01-01
     * @bodyParam end_date date optional End date. Example: 2024-03-31
     * @bodyParam notes string optional Notes. Example: On track
     *
     * @response 200 scenario="success" {"code": 200, "message": "Task updated successfully", "data": {"id": 1, "code": "TSK001", "name": "Build Foundation Updated", "status": "in_progress", "progress": 50, "project": {"id": 1, "code": "PRJ001", "name": "Project 1"}}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Task not found"}
     * @response 422 scenario="validation error" {"code": 422, "message": "Validation error", "errors": {"code": ["The code has already been taken."]}}
     */
    public function update(Request $request, Task $task): JsonResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'code' => 'required|string|max:30|unique:tasks,code,'.$task->id,
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

        return $this->successResponse($task->load('project:id,code,name'), 'Task updated successfully');
    }

    /**
     * Delete task
     *
     * @authenticated
     *
     * @urlParam task int required The task ID. Example: 1
     *
     * @response 200 scenario="success" {"code": 200, "message": "Task deleted successfully"}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Task not found"}
     */
    public function destroy(Task $task): JsonResponse
    {
        $task->delete();

        return $this->successResponse(null, 'Task deleted successfully');
    }

    /**
     * Update task progress
     *
     * @authenticated
     *
     * @urlParam task int required The task ID. Example: 1
     *
     * @bodyParam progress int required Progress percentage (0-100). Example: 75
     * @bodyParam achieved numeric optional Achieved amount. Example: 75
     * @bodyParam spent numeric optional Amount spent. Example: 37500000
     * @bodyParam notes string optional Progress notes. Example: Task is 75% complete
     *
     * @response 200 scenario="success" {"code": 200, "message": "Task progress updated successfully", "data": {"id": 1, "code": "TSK001", "name": "Build Foundation", "progress": 75, "achieved": 75, "spent": 37500000, "notes": "Task is 75% complete"}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Task not found"}
     * @response 422 scenario="validation error" {"code": 422, "message": "Validation error", "errors": {"progress": ["The progress field must be between 0 and 100."]}}
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

        return $this->successResponse($task, 'Task progress updated successfully');
    }

    /**
     * Get task summary statistics
     *
     * @authenticated
     *
     * @response 200 scenario="success" {"code": 200, "message": "Task summary retrieved successfully", "data": {"total": 100, "in_progress": 30, "completed": 50, "pending": 15, "on_hold": 5, "high_priority": 20}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
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

        return $this->successResponse($summary, 'Task summary retrieved successfully');
    }
}
