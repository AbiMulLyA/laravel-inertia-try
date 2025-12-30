<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use PHPOpenSourceSaver\JWTAuth\JWTGuard;

/**
 * @group Authentication
 *
 * API untuk autentikasi dan manajemen token menggunakan JWT
 */
class AuthApiController extends Controller
{
    use ApiResponse;

    /**
     * Get the JWT guard instance.
     *
     * This helper method provides proper type hinting for the JWTGuard,
     * resolving static analysis warnings for JWT-specific methods.
     *
     * @return JWTGuard
     */
    protected function guard(): JWTGuard
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');
        return $guard;
    }

    /**
     * Login and get access token
     *
     * Authenticate user with email and password, returns JWT token on success.
     *
     * @bodyParam email string required The user's email address. Example: user@example.com
     * @bodyParam password string required The user's password. Example: password123
     *
     * @response 200 scenario="success" {"code": 200, "message": "Login successful", "data": {"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...", "token_type": "bearer", "expires_in": 3600, "user": {"id": 1, "name": "John Doe", "email": "user@example.com"}}}
     * @response 422 scenario="validation error" {"code": 422, "message": "Email atau password salah.", "errors": {"email": ["Email atau password salah."]}}
     * @response 422 scenario="invalid email format" {"code": 422, "message": "Validation error", "errors": {"email": ["The email field must be a valid email address."]}}
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (!$token = $this->guard()->attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        return $this->respondWithToken($token, 'Login successful');
    }

    /**
     * Register new user
     *
     * Create a new user account and return JWT token.
     *
     * @bodyParam name string required The user's full name. Example: John Doe
     * @bodyParam email string required The user's email address. Example: user@example.com
     * @bodyParam password string required The user's password (min 8 characters). Example: password123
     * @bodyParam password_confirmation string required Password confirmation. Example: password123
     *
     * @response 201 scenario="success" {"code": 201, "message": "Registration successful", "data": {"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...", "token_type": "bearer", "expires_in": 3600, "user": {"id": 1, "name": "John Doe", "email": "user@example.com"}}}
     * @response 422 scenario="email already exists" {"code": 422, "message": "Validation error", "errors": {"email": ["The email has already been taken."]}}
     * @response 422 scenario="password too short" {"code": 422, "message": "Validation error", "errors": {"password": ["The password field must be at least 8 characters."]}}
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $this->guard()->login($user);

        return response()->json([
            'code' => 201,
            'message' => 'Registration successful',
            'data' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => $this->guard()->factory()->getTTL() * 60,
                'user' => $user
            ],
        ], 201);
    }

    /**
     * Get the authenticated User
     *
     * Returns the currently authenticated user's information.
     *
     * @authenticated
     *
     * @response 200 scenario="success" {"code": 200, "message": "User data retrieved", "data": {"id": 1, "name": "John Doe", "email": "user@example.com"}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     */
    public function user(): JsonResponse
    {
        return $this->successResponse($this->guard()->user(), 'User data retrieved');
    }

    /**
     * Log the user out (Invalidate the token)
     *
     * Invalidates the current JWT token.
     *
     * @authenticated
     *
     * @response 200 scenario="success" {"code": 200, "message": "Logout successful"}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     */
    public function logout(): JsonResponse
    {
        $this->guard()->logout();

        return $this->successResponse(null, 'Logout successful');
    }

    /**
     * Refresh a token
     *
     * Get a new token using the current valid token.
     *
     * @authenticated
     *
     * @response 200 scenario="success" {"code": 200, "message": "Token refreshed", "data": {"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...", "token_type": "bearer", "expires_in": 3600, "user": {"id": 1, "name": "John Doe", "email": "user@example.com"}}}
     * @response 401 scenario="unauthenticated" {"code": 401, "message": "Unauthenticated"}
     */
    public function refresh(): JsonResponse
    {
        return $this->respondWithToken($this->guard()->refresh(), 'Token refreshed');
    }

    /**
     * Get the token array structure.
     *
     * @param string $token The JWT token
     * @param string $message Response message
     * @return JsonResponse
     */
    protected function respondWithToken(string $token, string $message = 'Success'): JsonResponse
    {
        return $this->successResponse([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $this->guard()->factory()->getTTL() * 60,
            'user' => $this->guard()->user()
        ], $message);
    }
}
