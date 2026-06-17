<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

/**
 * @group Users
 *
 * API untuk manajemen user
 */
class UserApiController extends Controller
{
    use ApiResponse;

    /**
     * Get all users with pagination
     *
     * @authenticated
     *
     * @queryParam page int Page number. Example: 1
     * @queryParam per_page int Items per page. Example: 10
     * @queryParam search string Search by name or email. Example: admin
     *
     * @response 200 scenario="success" {"code": 200, "message": "Users retrieved successfully", "data": [{"id": 1, "name": "John Doe", "email": "john@example.com", "role": "Admin", "email_verified_at": "2024-01-01T00:00:00.000000Z", "created_at": "2024-01-01T00:00:00.000000Z"}], "meta": {"current_page": 1, "per_page": 10, "total": 50, "last_page": 5}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $query = User::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $this->paginatedResponse($users, 'Users retrieved successfully');
    }

    /**
     * Get single user
     *
     * @authenticated
     *
     * @urlParam user int required The user ID. Example: 1
     *
     * @response 200 scenario="success" {"code": 200, "message": "User retrieved successfully", "data": {"id": 1, "name": "John Doe", "email": "john@example.com", "role": "Admin", "email_verified_at": "2024-01-01T00:00:00.000000Z", "created_at": "2024-01-01T00:00:00.000000Z", "updated_at": "2024-01-01T00:00:00.000000Z"}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "User not found"}
     */
    public function show(User $user): JsonResponse
    {
        return $this->successResponse([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role ?? 'User',
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ], 'User retrieved successfully');
    }

    /**
     * Create new user
     *
     * @authenticated
     *
     * @bodyParam name string required Full name. Example: John Doe
     * @bodyParam email string required Email address. Example: john@example.com
     * @bodyParam password string required Password (min 8 chars). Example: password123
     * @bodyParam password_confirmation string required Password confirmation. Example: password123
     * @bodyParam role string optional User role. Example: Admin
     *
     * @response 201 scenario="success" {"code": 201, "message": "User created successfully", "data": {"id": 10, "name": "John Doe", "email": "john@example.com", "role": "Admin", "created_at": "2024-01-01T00:00:00.000000Z"}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 422 scenario="email exists" {"code": 422, "message": "Validation error", "errors": {"email": ["The email has already been taken."]}}
     * @response 422 scenario="password too short" {"code": 422, "message": "Validation error", "errors": {"password": ["The password field must be at least 8 characters."]}}
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Password::defaults(), 'confirmed'],
            'role' => ['nullable', 'string', 'max:50'],
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return $this->createdResponse([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'created_at' => $user->created_at,
        ], 'User created successfully');
    }

    /**
     * Update user
     *
     * @authenticated
     *
     * @urlParam user int required The user ID. Example: 1
     *
     * @bodyParam name string required Full name. Example: John Doe
     * @bodyParam email string required Email address. Example: john@example.com
     * @bodyParam password string optional New password (min 8 chars). Example: newpassword123
     * @bodyParam password_confirmation string optional Password confirmation (required if password provided). Example: newpassword123
     * @bodyParam role string optional User role. Example: Admin
     *
     * @response 200 scenario="success" {"code": 200, "message": "User updated successfully", "data": {"id": 1, "name": "John Doe Updated", "email": "john@example.com", "role": "Admin", "updated_at": "2024-01-01T00:00:00.000000Z"}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 404 scenario="not found" {"code": 404, "message": "User not found"}
     * @response 422 scenario="validation error" {"code": 422, "message": "Validation error", "errors": {"email": ["The email has already been taken."]}}
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'password' => ['nullable', Password::defaults(), 'confirmed'],
            'role' => ['nullable', 'string', 'max:50'],
        ]);

        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return $this->successResponse([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'updated_at' => $user->updated_at,
        ], 'User updated successfully');
    }

    /**
     * Delete user
     *
     * @authenticated
     *
     * @urlParam user int required The user ID. Example: 1
     *
     * @response 200 scenario="success" {"code": 200, "message": "User deleted successfully"}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     * @response 403 scenario="delete self" {"code": 403, "message": "You cannot delete your own account"}
     * @response 404 scenario="not found" {"code": 404, "message": "User not found"}
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        // Prevent deleting self
        if ($user->id === auth('api')->id()) {
            return $this->forbiddenResponse('You cannot delete your own account');
        }

        $user->delete();

        return $this->successResponse(null, 'User deleted successfully');
    }

    /**
     * Get user summary statistics
     *
     * @authenticated
     *
     * @response 200 scenario="success" {"code": 200, "message": "User summary retrieved successfully", "data": {"total": 100, "this_month": 10, "verified": 90, "unverified": 10}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     */
    public function summary(): JsonResponse
    {
        $summary = [
            'total' => User::count(),
            'this_month' => User::whereMonth('created_at', now()->month)->count(),
            'verified' => User::whereNotNull('email_verified_at')->count(),
            'unverified' => User::whereNull('email_verified_at')->count(),
        ];

        return $this->successResponse($summary, 'User summary retrieved successfully');
    }
}
