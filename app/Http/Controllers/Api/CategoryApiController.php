<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
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
    use ApiResponse;

    /**
     * Get all categories
     *
     * @authenticated
     *
     * @queryParam with_stats boolean Include project statistics. Example: true
     *
     * @response 200 scenario="success" {"code": 200, "message": "Categories retrieved successfully", "data": [{"id": 1, "code": "CAT001", "name": "Category 1", "description": "Description", "is_active": true}]}
     * @response 200 scenario="with stats" {"code": 200, "message": "Categories retrieved successfully", "data": [{"id": 1, "code": "CAT001", "name": "Category 1", "description": "Description", "is_active": true, "total_projects": 5, "total_budget": 100000000, "total_spent": 50000000}]}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
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

        return $this->successResponse($categories, 'Categories retrieved successfully');
    }

    /**
     * Get single category
     *
     * @authenticated
     *
     * @urlParam category int required The category ID. Example: 1
     *
     * @response 200 scenario="success" {"code": 200, "message": "Category retrieved successfully", "data": {"id": 1, "code": "CAT001", "name": "Category 1", "description": "Description", "is_active": true}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Category not found"}
     */
    public function show(Category $category): JsonResponse
    {
        return $this->successResponse($category, 'Category retrieved successfully');
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
     * @response 201 scenario="success" {"code": 201, "message": "Category created successfully", "data": {"id": 1, "code": "CAT001", "name": "Infrastructure", "description": "Infrastructure projects", "is_active": true}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 422 scenario="validation error" {"code": 422, "message": "Validation error", "errors": {"code": ["The code has already been taken."]}}
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

        return $this->createdResponse($category, 'Category created successfully');
    }

    /**
     * Update category
     *
     * @authenticated
     *
     * @urlParam category int required The category ID. Example: 1
     * @bodyParam code string required Category code, max 20 chars, unique. Example: CAT001
     * @bodyParam name string required Category name, max 255 chars. Example: Infrastructure
     * @bodyParam description string optional Description. Example: Infrastructure projects
     * @bodyParam is_active boolean optional Active status. Example: true
     *
     * @response 200 scenario="success" {"code": 200, "message": "Category updated successfully", "data": {"id": 1, "code": "CAT001", "name": "Infrastructure Updated", "description": "Updated description", "is_active": true}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Category not found"}
     * @response 422 scenario="validation error" {"code": 422, "message": "Validation error", "errors": {"code": ["The code has already been taken."]}}
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

        return $this->successResponse($category, 'Category updated successfully');
    }

    /**
     * Delete category
     *
     * @authenticated
     *
     * @urlParam category int required The category ID. Example: 1
     *
     * @response 200 scenario="success" {"code": 200, "message": "Category deleted successfully"}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Category not found"}
     * @response 409 scenario="has relations" {"code": 409, "message": "Cannot delete category with associated projects"}
     */
    public function destroy(Category $category): JsonResponse
    {
        if ($category->projects()->exists()) {
            return $this->conflictResponse('Cannot delete category with associated projects');
        }

        $category->delete();

        return $this->successResponse(null, 'Category deleted successfully');
    }
}
