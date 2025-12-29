<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * Display a listing of permissions.
     */
    public function index()
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

        $grouped = $permissions->groupBy('group');

        $summary = [
            'total' => $permissions->count(),
            'groups' => $grouped->keys()->count(),
        ];

        return Inertia::render('Settings/Permissions/Index', [
            'permissions' => $permissions,
            'grouped' => $grouped,
            'summary' => $summary,
        ]);
    }

    /**
     * Show the form for creating a new permission.
     */
    public function create()
    {
        $groups = Permission::distinct()->pluck('group')->toArray();

        return Inertia::render('Settings/Permissions/Form', [
            'permission' => null,
            'groups' => $groups,
            'isEdit' => false,
        ]);
    }

    /**
     * Store a newly created permission.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:permissions'],
            'display_name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'group' => ['required', 'string', 'max:50'],
        ]);

        Permission::create($validated);

        return redirect()->route('settings.permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    /**
     * Show the form for editing the specified permission.
     */
    public function edit(Permission $permission)
    {
        $groups = Permission::distinct()->pluck('group')->toArray();

        return Inertia::render('Settings/Permissions/Form', [
            'permission' => [
                'id' => $permission->id,
                'name' => $permission->name,
                'display_name' => $permission->display_name,
                'description' => $permission->description,
                'group' => $permission->group,
            ],
            'groups' => $groups,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified permission.
     */
    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:permissions,name,' . $permission->id],
            'display_name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'group' => ['required', 'string', 'max:50'],
        ]);

        $permission->update($validated);

        return redirect()->route('settings.permissions.index')
            ->with('success', 'Permission updated successfully.');
    }

    /**
     * Remove the specified permission.
     */
    public function destroy(Permission $permission)
    {
        // Detach from all roles first
        $permission->roles()->detach();
        $permission->delete();

        return redirect()->route('settings.permissions.index')
            ->with('success', 'Permission deleted successfully.');
    }
}
