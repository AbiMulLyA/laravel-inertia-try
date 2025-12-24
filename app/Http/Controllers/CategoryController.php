<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * CategoryController
 * 
 * Example controller for master data CRUD operations.
 * Use this as a template for simple CRUD controllers.
 */
class CategoryController extends Controller
{
    /**
     * Display listing of categories
     */
    public function index(): InertiaResponse
    {
        $categories = Category::withCount(['projects'])
            ->with([
                'projects' => function ($query) {
                    $query->select('id', 'category_id', 'budget', 'spent');
                }
            ])
            ->orderBy('code')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'code' => $item->code,
                    'name' => $item->name,
                    'description' => $item->description,
                    'is_active' => $item->is_active,
                    'total_projects' => $item->projects_count,
                    'total_budget' => $item->projects->sum('budget'),
                    'total_spent' => $item->projects->sum('spent'),
                ];
            });

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show create form
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Categories/Form');
    }

    /**
     * Store new category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:categories,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Category::create($validated);

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Show edit form
     */
    public function edit(Category $category): InertiaResponse
    {
        return Inertia::render('Categories/Form', [
            'category' => $category,
        ]);
    }

    /**
     * Update category
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:categories,code,' . $category->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Delete category
     */
    public function destroy(Category $category)
    {
        // Check if category has related data
        if ($category->projects()->exists()) {
            return back()->with('error', 'Cannot delete category with associated projects.');
        }

        $category->delete();

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
