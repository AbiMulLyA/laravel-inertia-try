<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Projects
 *
 * API untuk manajemen proyek
 */
class ProjectApiController extends Controller
{
    use ApiResponse;

    /**
     * Get all projects with pagination
     *
     * @authenticated
     *
     * @queryParam page int Page number. Example: 1
     * @queryParam per_page int Items per page. Example: 15
     * @queryParam category_id int Filter by category ID. Example: 1
     * @queryParam status string Filter by status (draft, active, completed). Example: active
     * @queryParam search string Search by name or code. Example: project
     * @queryParam year int Filter by year. Example: 2024
     *
     * @response 200 scenario="success" {"code": 200, "message": "Projects retrieved successfully", "data": [{"id": 1, "code": "PRJ001", "name": "Project 1", "status": "active", "category": {"id": 1, "code": "CAT001", "name": "Category 1"}}], "meta": {"current_page": 1, "per_page": 15, "total": 50, "last_page": 4}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $categoryId = $request->input('category_id');
        $status = $request->input('status');
        $search = $request->input('search');
        $year = $request->input('year');

        $query = Project::with('category:id,code,name');

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($year) {
            $query->where('year', $year);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('code', 'ilike', "%{$search}%");
            });
        }

        $projects = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $this->paginatedResponse($projects, 'Projects retrieved successfully');
    }

    /**
     * Get single project
     *
     * @authenticated
     *
     * @urlParam project int required The project ID. Example: 1
     *
     * @response 200 scenario="success" {"code": 200, "message": "Project retrieved successfully", "data": {"id": 1, "code": "PRJ001", "name": "Project 1", "status": "active", "budget": 100000000, "spent": 50000000, "category": {"id": 1, "code": "CAT001", "name": "Category 1"}, "tasks": []}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Project not found"}
     */
    public function show(Project $project): JsonResponse
    {
        $project->load(['category:id,code,name', 'tasks']);

        return $this->successResponse($project, 'Project retrieved successfully');
    }

    /**
     * Create new project
     *
     * @authenticated
     *
     * @bodyParam category_id int required Category ID. Example: 1
     * @bodyParam code string required Project code, max 30 chars, unique. Example: PRJ001
     * @bodyParam name string required Project name, max 255 chars. Example: Infrastructure Project
     * @bodyParam description string optional Description. Example: Project description
     * @bodyParam year int required Year (2020-2100). Example: 2024
     * @bodyParam budget numeric required Budget amount. Example: 100000000
     * @bodyParam status string required Status (draft, active, completed). Example: draft
     * @bodyParam start_date date optional Start date. Example: 2024-01-01
     * @bodyParam end_date date optional End date. Example: 2024-12-31
     *
     * @response 201 scenario="success" {"code": 201, "message": "Project created successfully", "data": {"id": 1, "code": "PRJ001", "name": "Infrastructure Project", "status": "draft", "budget": 100000000, "category": {"id": 1, "code": "CAT001", "name": "Category 1"}}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 422 scenario="validation error" {"code": 422, "message": "Validation error", "errors": {"code": ["The code has already been taken."]}}
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'code' => 'required|string|max:30|unique:projects,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'year' => 'required|integer|min:2020|max:2100',
            'budget' => 'required|numeric|min:0',
            'status' => 'required|in:draft,active,completed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $project = Project::create($validated);

        return $this->createdResponse($project->load('category:id,code,name'), 'Project created successfully');
    }

    /**
     * Update project
     *
     * @authenticated
     *
     * @urlParam project int required The project ID. Example: 1
     *
     * @bodyParam category_id int required Category ID. Example: 1
     * @bodyParam code string required Project code, max 30 chars, unique. Example: PRJ001
     * @bodyParam name string required Project name, max 255 chars. Example: Infrastructure Project
     * @bodyParam description string optional Description. Example: Project description
     * @bodyParam year int required Year (2020-2100). Example: 2024
     * @bodyParam budget numeric required Budget amount. Example: 100000000
     * @bodyParam spent numeric optional Amount spent. Example: 50000000
     * @bodyParam status string required Status (draft, active, completed). Example: active
     * @bodyParam start_date date optional Start date. Example: 2024-01-01
     * @bodyParam end_date date optional End date. Example: 2024-12-31
     *
     * @response 200 scenario="success" {"code": 200, "message": "Project updated successfully", "data": {"id": 1, "code": "PRJ001", "name": "Updated Project", "status": "active", "category": {"id": 1, "code": "CAT001", "name": "Category 1"}}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Project not found"}
     * @response 422 scenario="validation error" {"code": 422, "message": "Validation error", "errors": {"code": ["The code has already been taken."]}}
     */
    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'code' => 'required|string|max:30|unique:projects,code,'.$project->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'year' => 'required|integer|min:2020|max:2100',
            'budget' => 'required|numeric|min:0',
            'spent' => 'nullable|numeric|min:0',
            'status' => 'required|in:draft,active,completed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $project->update($validated);

        return $this->successResponse($project->load('category:id,code,name'), 'Project updated successfully');
    }

    /**
     * Delete project
     *
     * @authenticated
     *
     * @urlParam project int required The project ID. Example: 1
     *
     * @response 200 scenario="success" {"code": 200, "message": "Project deleted successfully"}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Project not found"}
     */
    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return $this->successResponse(null, 'Project deleted successfully');
    }

    /**
     * Get project summary statistics
     *
     * @authenticated
     *
     * @response 200 scenario="success" {"code": 200, "message": "Project summary retrieved successfully", "data": {"total": 50, "active": 20, "completed": 25, "draft": 5, "total_budget": 5000000000, "total_spent": 2500000000}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     */
    public function summary(): JsonResponse
    {
        $summary = [
            'total' => Project::count(),
            'active' => Project::where('status', 'active')->count(),
            'completed' => Project::where('status', 'completed')->count(),
            'draft' => Project::where('status', 'draft')->count(),
            'total_budget' => Project::sum('budget'),
            'total_spent' => Project::sum('spent'),
        ];

        return $this->successResponse($summary, 'Project summary retrieved successfully');
    }
}
