<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
    /**
     * Get all roles
     *
     * @authenticated
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

        return response()->json([
            'success' => true,
            'data' => $roles,
        ]);
    }

    /**
     * Get single role with permissions
     *
     * @authenticated
     *
     * @urlParam role int required The role ID. Example: 1
     */
    public function show(Role $role): JsonResponse
    {
        $role->load('permissions');

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'display_name' => $role->display_name,
                'description' => $role->description,
                'color' => $role->color,
                'is_default' => $role->is_default,
                'permissions' => $role->permissions->pluck('id'),
                'created_at' => $role->created_at,
            ],
        ]);
    }

    /**
     * Create new role
     *
     * @authenticated
     *
     * @bodyParam name string required Unique role name. Example: manager
     * @bodyParam display_name string required Display name. Example: Manager
     * @bodyParam description string optional Description. Example: Manager role
     * @bodyParam color string required Hex color code. Example: #3B82F6
     * @bodyParam is_default boolean optional Set as default. Example: false
     * @bodyParam permissions array optional Array of permission IDs. Example: [1, 2, 3]
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

        return response()->json([
            'success' => true,
            'message' => 'Role created successfully',
            'data' => $role,
        ], 201);
    }

    /**
     * Update role
     *
     * @authenticated
     *
     * @urlParam role int required The role ID. Example: 1
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

        return response()->json([
            'success' => true,
            'message' => 'Role updated successfully',
            'data' => $role,
        ]);
    }

    /**
     * Delete role
     *
     * @authenticated
     *
     * @urlParam role int required The role ID. Example: 1
     */
    public function destroy(Role $role): JsonResponse
    {
        // Check if role has users
        if ($role->users()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete role with assigned users',
            ], 409);
        }

        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully',
        ]);
    }

    /**
     * Get available permissions grouped
     *
     * @authenticated
     */
    public function availablePermissions(): JsonResponse
    {
        $permissions = Permission::getGrouped();

        return response()->json([
            'success' => true,
            'data' => $permissions,
        ]);
    }
}
