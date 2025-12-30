<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
    /**
     * Get all permissions
     *
     * @authenticated
     *
     * @queryParam grouped boolean Return grouped by 'group' field. Example: true
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

        return response()->json([
            'success' => true,
            'data' => $permissions,
        ]);
    }

    /**
     * Get single permission
     *
     * @authenticated
     *
     * @urlParam permission int required The permission ID. Example: 1
     */
    public function show(Permission $permission): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $permission,
        ]);
    }

    /**
     * Create new permission
     *
     * @authenticated
     *
     * @bodyParam name string required Unique permission name. Example: users.create
     * @bodyParam display_name string required Display name. Example: Create Users
     * @bodyParam description string optional Description. Example: Allows creating new users
     * @bodyParam group string required Permission group. Example: Users
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

        return response()->json([
            'success' => true,
            'message' => 'Permission created successfully',
            'data' => $permission,
        ], 201);
    }

    /**
     * Update permission
     *
     * @authenticated
     *
     * @urlParam permission int required The permission ID. Example: 1
     */
    public function update(Request $request, Permission $permission): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:permissions,name,' . $permission->id],
            'display_name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'group' => ['required', 'string', 'max:50'],
        ]);

        $permission->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Permission updated successfully',
            'data' => $permission,
        ]);
    }

    /**
     * Delete permission
     *
     * @authenticated
     *
     * @urlParam permission int required The permission ID. Example: 1
     */
    public function destroy(Permission $permission): JsonResponse
    {
        // Detach from all roles first
        $permission->roles()->detach();
        $permission->delete();

        return response()->json([
            'success' => true,
            'message' => 'Permission deleted successfully',
        ]);
    }

    /**
     * Get unique permission groups
     *
     * @authenticated
     */
    public function groups(): JsonResponse
    {
        $groups = Permission::distinct()->pluck('group');

        return response()->json([
            'success' => true,
            'data' => $groups,
        ]);
    }
}
