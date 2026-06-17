<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Permissions
 *
 * API untuk manajemen permission
 */
class PermissionApiController extends Controller
{
    use ApiResponse;

    /**
     * Get all permissions
     *
     * @authenticated
     *
     * @queryParam grouped boolean Return grouped by 'group' field. Example: true
     *
     * @response 200 scenario="success" {"code": 200, "message": "Permissions retrieved successfully", "data": [{"id": 1, "name": "users.view", "display_name": "View Users", "description": "Can view users list", "group": "Users", "roles_count": 3}]}
     * @response 200 scenario="grouped" {"code": 200, "message": "Permissions retrieved successfully", "data": {"Users": [{"id": 1, "name": "users.view", "display_name": "View Users"}], "Projects": [{"id": 2, "name": "projects.view", "display_name": "View Projects"}]}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     */
    public function index(Request $request): JsonResponse
    {
        $permissions = Permission::withCount('roles')
            ->orderBy('group')
            ->orderBy('display_name')
            ->get()
            ->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'display_name' => $permission->display_name,
                    'description' => $permission->description,
                    'group' => $permission->group,
                    'roles_count' => $permission->roles_count,
                    'created_at' => $permission->created_at,
                ];
            });

        if ($request->boolean('grouped')) {
            $permissions = $permissions->groupBy('group');
        }

        return $this->successResponse($permissions, 'Permissions retrieved successfully');
    }

    /**
     * Get single permission
     *
     * @authenticated
     *
     * @urlParam permission int required The permission ID. Example: 1
     *
     * @response 200 scenario="success" {"code": 200, "message": "Permission retrieved successfully", "data": {"id": 1, "name": "users.view", "display_name": "View Users", "description": "Can view users list", "group": "Users"}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Permission not found"}
     */
    public function show(Permission $permission): JsonResponse
    {
        return $this->successResponse($permission, 'Permission retrieved successfully');
    }

    /**
     * Create new permission
     *
     * @authenticated
     *
     * @bodyParam name string required Unique permission name. Example: users.export
     * @bodyParam display_name string required Display name. Example: Export Users
     * @bodyParam description string optional Description. Example: Allows exporting users to CSV
     * @bodyParam group string required Permission group. Example: Users
     *
     * @response 201 scenario="success" {"code": 201, "message": "Permission created successfully", "data": {"id": 10, "name": "users.export", "display_name": "Export Users", "description": "Allows exporting users to CSV", "group": "Users"}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 422 scenario="validation error" {"code": 422, "message": "Validation error", "errors": {"name": ["The name has already been taken."]}}
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:permissions'],
            'display_name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'group' => ['required', 'string', 'max:50'],
        ]);

        $permission = Permission::create($validated);

        return $this->createdResponse($permission, 'Permission created successfully');
    }

    /**
     * Update permission
     *
     * @authenticated
     *
     * @urlParam permission int required The permission ID. Example: 1
     *
     * @bodyParam name string required Unique permission name. Example: users.export
     * @bodyParam display_name string required Display name. Example: Export Users
     * @bodyParam description string optional Description. Example: Allows exporting users to CSV
     * @bodyParam group string required Permission group. Example: Users
     *
     * @response 200 scenario="success" {"code": 200, "message": "Permission updated successfully", "data": {"id": 1, "name": "users.export", "display_name": "Export Users Updated", "description": "Updated description", "group": "Users"}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Permission not found"}
     * @response 422 scenario="validation error" {"code": 422, "message": "Validation error", "errors": {"name": ["The name has already been taken."]}}
     */
    public function update(Request $request, Permission $permission): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:permissions,name,'.$permission->id],
            'display_name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'group' => ['required', 'string', 'max:50'],
        ]);

        $permission->update($validated);

        return $this->successResponse($permission, 'Permission updated successfully');
    }

    /**
     * Delete permission
     *
     * @authenticated
     *
     * @urlParam permission int required The permission ID. Example: 1
     *
     * @response 200 scenario="success" {"code": 200, "message": "Permission deleted successfully"}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Permission not found"}
     */
    public function destroy(Permission $permission): JsonResponse
    {
        // Detach from all roles first
        $permission->roles()->detach();
        $permission->delete();

        return $this->successResponse(null, 'Permission deleted successfully');
    }

    /**
     * Get unique permission groups
     *
     * @authenticated
     *
     * @response 200 scenario="success" {"code": 200, "message": "Permission groups retrieved successfully", "data": ["Users", "Projects", "Tasks", "Categories", "Roles", "Permissions"]}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     */
    public function groups(): JsonResponse
    {
        $groups = Permission::distinct()->pluck('group');

        return $this->successResponse($groups, 'Permission groups retrieved successfully');
    }
}
