<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * ProjectController
 * 
 * Example controller for relational data CRUD operations.
 * Demonstrates: filtering, pagination, relationships.
 */
class ProjectController extends Controller
{
    /**
     * Display listing of projects
     */
    public function index(Request $request): InertiaResponse
    {
        $categoryId = $request->input('category_id');
        $status = $request->input('status');
        $search = $request->input('search');

        $query = Project::with('category:id,code,name');

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $projects = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'code' => $item->code,
                    'name' => $item->name,
                    'category' => $item->category,
                    'year' => $item->year,
                    'budget' => $item->budget,
                    'spent' => $item->spent,
                    'spent_percentage' => $item->spent_percentage,
                    'status' => $item->status,
                    'status_label' => $item->status_label,
                    'start_date' => $item->start_date?->format('Y-m-d'),
                    'end_date' => $item->end_date?->format('Y-m-d'),
                ];
            });

        $categories = Category::active()
            ->select('id', 'code', 'name')
            ->orderBy('name')
            ->get();

        // Summary statistics
        $summary = [
            'total' => Project::count(),
            'active' => Project::where('status', 'active')->count(),
            'completed' => Project::where('status', 'completed')->count(),
            'draft' => Project::where('status', 'draft')->count(),
        ];

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'categories' => $categories,
            'filters' => [
                'category_id' => $categoryId,
                'status' => $status,
                'search' => $search,
            ],
            'summary' => $summary,
            'statuses' => Project::STATUSES,
        ]);
    }

    /**
     * Show create form
     */
    public function create(): InertiaResponse
    {
        $categories = Category::active()
            ->select('id', 'code', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Projects/Form', [
            'categories' => $categories,
            'statuses' => Project::STATUSES,
        ]);
    }

    /**
     * Store new project
     */
    public function store(Request $request)
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

        Project::create($validated);

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    /**
     * Show edit form
     */
    public function edit(Project $project): InertiaResponse
    {
        $categories = Category::active()
            ->select('id', 'code', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Projects/Form', [
            'project' => $project,
            'categories' => $categories,
            'statuses' => Project::STATUSES,
        ]);
    }

    /**
     * Update project
     */
    public function update(Request $request, Project $project)
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

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Delete project
     */
    public function destroy(Project $project)
    {
        // Tasks will be cascade deleted due to foreign key constraint
        $project->delete();

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
