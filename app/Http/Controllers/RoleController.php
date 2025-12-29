<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index()
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

        $summary = [
            'total' => $roles->count(),
            'with_users' => $roles->where('users_count', '>', 0)->count(),
        ];

        return Inertia::render('Settings/Roles/Index', [
            'roles' => $roles,
            'summary' => $summary,
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        $permissions = Permission::getGrouped();

        return Inertia::render('Settings/Roles/Form', [
            'role' => null,
            'permissions' => $permissions,
            'isEdit' => false,
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
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

        return redirect()->route('settings.roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role)
    {
        $permissions = Permission::getGrouped();
        $rolePermissions = $role->permissions()->pluck('permissions.id')->toArray();

        return Inertia::render('Settings/Roles/Form', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'display_name' => $role->display_name,
                'description' => $role->description,
                'color' => $role->color,
                'is_default' => $role->is_default,
                'permissions' => $rolePermissions,
            ],
            'permissions' => $permissions,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified role.
     */
    public function update(Request $request, Role $role)
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

        return redirect()->route('settings.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role.
     */
    public function destroy(Role $role)
    {
        // Check if role has users
        if ($role->users()->count() > 0) {
            return back()->with('error', 'Cannot delete role with assigned users.');
        }

        $role->delete();

        return redirect()->route('settings.roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}
