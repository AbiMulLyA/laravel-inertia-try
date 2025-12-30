<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Categories
 *
 * API untuk manajemen kategori
 */
class CategoryApiController extends Controller
{
    /**
     * Get all categories
     *
     * @authenticated
     *
     * @queryParam with_stats boolean Include project statistics. Example: true
     *
     * @response 200 {
     *   "success": true,
     *   "data": [
     *     {"id": 1, "code": "CAT001", "name": "Category 1", "description": "Description", "is_active": true}
     *   ]
     * }
     */
    public function index(Request $request): JsonResponse
    {
        $query = Category::query();

        if ($request->boolean('with_stats')) {
            $query->withCount(['projects'])
                ->with([
                    'projects' => function ($q) {
                        $q->select('id', 'category_id', 'budget', 'spent');
                    }
                ]);
        }

        $categories = $query->orderBy('code')->get();

        if ($request->boolean('with_stats')) {
            $categories = $categories->map(function ($item) {
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
        }

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Get single category
     *
     * @authenticated
     *
     * @urlParam category int required The category ID. Example: 1
     *
     * @response 200 {
     *   "success": true,
     *   "data": {"id": 1, "code": "CAT001", "name": "Category 1"}
     * }
     */
    public function show(Category $category): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    /**
     * Create new category
     *
     * @authenticated
     *
     * @bodyParam code string required Category code, max 20 chars, unique. Example: CAT001
     * @bodyParam name string required Category name, max 255 chars. Example: Infrastructure
     * @bodyParam description string optional Description. Example: Infrastructure projects
     * @bodyParam is_active boolean optional Active status. Example: true
     *
     * @response 201 {
     *   "success": true,
     *   "message": "Category created successfully",
     *   "data": {"id": 1, "code": "CAT001", "name": "Infrastructure"}
     * }
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:categories,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category,
        ], 201);
    }

    /**
     * Update category
     *
     * @authenticated
     *
     * @urlParam category int required The category ID. Example: 1
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:categories,code,' . $category->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $category,
        ]);
    }

    /**
     * Delete category
     *
     * @authenticated
     *
     * @urlParam category int required The category ID. Example: 1
     *
     * @response 200 {
     *   "success": true,
     *   "message": "Category deleted successfully"
     * }
     * @response 409 {
     *   "success": false,
     *   "message": "Cannot delete category with associated projects"
     * }
     */
    public function destroy(Category $category): JsonResponse
    {
        if ($category->projects()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category with associated projects',
            ], 409);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ]);
    }
}
