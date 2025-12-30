<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
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

        return response()->json([
            'success' => true,
            'data' => $projects->items(),
            'meta' => [
                'current_page' => $projects->currentPage(),
                'per_page' => $projects->perPage(),
                'total' => $projects->total(),
                'last_page' => $projects->lastPage(),
            ],
        ]);
    }

    /**
     * Get single project
     *
     * @authenticated
     *
     * @urlParam project int required The project ID. Example: 1
     */
    public function show(Project $project): JsonResponse
    {
        $project->load(['category:id,code,name', 'tasks']);

        return response()->json([
            'success' => true,
            'data' => $project,
        ]);
    }

    /**
     * Create new project
     *
     * @authenticated
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

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $project->load('category:id,code,name'),
        ], 201);
    }

    /**
     * Update project
     *
     * @authenticated
     *
     * @urlParam project int required The project ID. Example: 1
     */
    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'code' => 'required|string|max:30|unique:projects,code,' . $project->id,
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

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => $project->load('category:id,code,name'),
        ]);
    }

    /**
     * Delete project
     *
     * @authenticated
     *
     * @urlParam project int required The project ID. Example: 1
     */
    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully',
        ]);
    }

    /**
     * Get project summary statistics
     *
     * @authenticated
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

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }
}
