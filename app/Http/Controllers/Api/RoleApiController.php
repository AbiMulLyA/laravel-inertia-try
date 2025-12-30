<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Roles
 *
 * API untuk manajemen role
 */
class RoleApiController extends Controller
{
    use ApiResponse;

    /**
     * Get all roles
     *
     * @authenticated
     *
     * @response 200 scenario="success" {"code": 200, "message": "Roles retrieved successfully", "data": [{"id": 1, "name": "admin", "display_name": "Administrator", "description": "Full access", "color": "#EF4444", "is_default": false, "users_count": 5, "permissions_count": 20}]}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     */
    public function index(): JsonResponse
    {
        $roles = Role::withCount(['users', 'permissions'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'display_name' => $role->display_name,
                    'description' => $role->description,
                    'color' => $role->color,
                    'is_default' => $role->is_default,
                    'users_count' => $role->users_count,
                    'permissions_count' => $role->permissions_count,
                    'created_at' => $role->created_at,
                ];
            });

        return $this->successResponse($roles, 'Roles retrieved successfully');
    }

    /**
     * Get single role with permissions
     *
     * @authenticated
     *
     * @urlParam role int required The role ID. Example: 1
     *
     * @response 200 scenario="success" {"code": 200, "message": "Role retrieved successfully", "data": {"id": 1, "name": "admin", "display_name": "Administrator", "description": "Full access", "color": "#EF4444", "is_default": false, "permissions": [1, 2, 3]}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Role not found"}
     */
    public function show(Role $role): JsonResponse
    {
        $role->load('permissions');

        return $this->successResponse([
            'id' => $role->id,
            'name' => $role->name,
            'display_name' => $role->display_name,
            'description' => $role->description,
            'color' => $role->color,
            'is_default' => $role->is_default,
            'permissions' => $role->permissions->pluck('id'),
            'created_at' => $role->created_at,
        ], 'Role retrieved successfully');
    }

    /**
     * Create new role
     *
     * @authenticated
     *
     * @bodyParam name string required Unique role name. Example: manager
     * @bodyParam display_name string required Display name. Example: Manager
     * @bodyParam description string optional Description. Example: Manager role with limited access
     * @bodyParam color string required Hex color code. Example: #3B82F6
     * @bodyParam is_default boolean optional Set as default role for new users. Example: false
     * @bodyParam permissions array optional Array of permission IDs. Example: [1, 2, 3]
     *
     * @response 201 scenario="success" {"code": 201, "message": "Role created successfully", "data": {"id": 2, "name": "manager", "display_name": "Manager", "description": "Manager role with limited access", "color": "#3B82F6", "is_default": false}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 422 scenario="validation error" {"code": 422, "message": "Validation error", "errors": {"name": ["The name has already been taken."]}}
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', 'unique:roles'],
            'display_name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'color' => ['required', 'string', 'max:7'],
            'is_default' => ['boolean'],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        // If setting as default, unset other defaults
        if ($validated['is_default'] ?? false) {
            Role::where('is_default', true)->update(['is_default' => false]);
        }

        $role = Role::create($validated);

        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return $this->createdResponse($role, 'Role created successfully');
    }

    /**
     * Update role
     *
     * @authenticated
     *
     * @urlParam role int required The role ID. Example: 1
     * @bodyParam name string required Unique role name. Example: manager
     * @bodyParam display_name string required Display name. Example: Manager
     * @bodyParam description string optional Description. Example: Manager role with limited access
     * @bodyParam color string required Hex color code. Example: #3B82F6
     * @bodyParam is_default boolean optional Set as default role for new users. Example: false
     * @bodyParam permissions array optional Array of permission IDs. Example: [1, 2, 3]
     *
     * @response 200 scenario="success" {"code": 200, "message": "Role updated successfully", "data": {"id": 2, "name": "manager", "display_name": "Manager Updated", "description": "Updated description", "color": "#3B82F6", "is_default": false}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Role not found"}
     * @response 422 scenario="validation error" {"code": 422, "message": "Validation error", "errors": {"name": ["The name has already been taken."]}}
     */
    public function update(Request $request, Role $role): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', 'unique:roles,name,' . $role->id],
            'display_name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'color' => ['required', 'string', 'max:7'],
            'is_default' => ['boolean'],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        // If setting as default, unset other defaults
        if ($validated['is_default'] ?? false) {
            Role::where('is_default', true)->where('id', '!=', $role->id)->update(['is_default' => false]);
        }

        $role->update($validated);
        $role->syncPermissions($validated['permissions'] ?? []);

        return $this->successResponse($role, 'Role updated successfully');
    }

    /**
     * Delete role
     *
     * @authenticated
     *
     * @urlParam role int required The role ID. Example: 1
     *
     * @response 200 scenario="success" {"code": 200, "message": "Role deleted successfully"}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "Role not found"}
     * @response 409 scenario="has users" {"code": 409, "message": "Cannot delete role with assigned users"}
     */
    public function destroy(Role $role): JsonResponse
    {
        // Check if role has users
        if ($role->users()->count() > 0) {
            return $this->conflictResponse('Cannot delete role with assigned users');
        }

        $role->delete();

        return $this->successResponse(null, 'Role deleted successfully');
    }

    /**
     * Get available permissions grouped
     *
     * @authenticated
     *
     * @response 200 scenario="success" {"code": 200, "message": "Permissions retrieved successfully", "data": {"Users": [{"id": 1, "name": "users.view", "display_name": "View Users"}], "Projects": [{"id": 2, "name": "projects.view", "display_name": "View Projects"}]}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     */
    public function availablePermissions(): JsonResponse
    {
        $permissions = Permission::getGrouped();

        return $this->successResponse($permissions, 'Permissions retrieved successfully');
    }
}
