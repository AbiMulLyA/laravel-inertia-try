<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
     * @response 200 {
     *   "success": true,
     *   "data": {
     *     "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
     *     "token_type": "bearer",
     *     "expires_in": 3600,
     *     "user": {"id": 1, "name": "John Doe", "email": "user@example.com"}
     *   }
     * }
     * @response 422 {
     *   "message": "Email atau password salah.",
     *   "errors": {"email": ["Email atau password salah."]}
     * }
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

        return $this->respondWithToken($token);
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
     * @response 201 {
     *   "success": true,
     *   "message": "Registrasi berhasil",
     *   "data": {
     *     "user": {"id": 1, "name": "John Doe", "email": "user@example.com"},
     *     "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
     *     "token_type": "bearer",
     *     "expires_in": 3600
     *   }
     * }
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
            'success' => true,
            'message' => 'Registrasi berhasil',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => $this->guard()->factory()->getTTL() * 60
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
     * @response 200 {
     *   "success": true,
     *   "data": {"id": 1, "name": "John Doe", "email": "user@example.com"}
     * }
     */
    public function user(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->guard()->user(),
        ]);
    }

    /**
     * Log the user out (Invalidate the token)
     *
     * Invalidates the current JWT token.
     *
     * @authenticated
     *
     * @response 200 {
     *   "success": true,
     *   "message": "Logout berhasil"
     * }
     */
    public function logout(): JsonResponse
    {
        $this->guard()->logout();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil',
        ]);
    }

    /**
     * Refresh a token
     *
     * Get a new token using the current valid token.
     *
     * @authenticated
     *
     * @response 200 {
     *   "success": true,
     *   "data": {
     *     "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
     *     "token_type": "bearer",
     *     "expires_in": 3600,
     *     "user": {"id": 1, "name": "John Doe", "email": "user@example.com"}
     *   }
     * }
     */
    public function refresh(): JsonResponse
    {
        return $this->respondWithToken($this->guard()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param string $token The JWT token
     * @return JsonResponse
     */
    protected function respondWithToken(string $token): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => $this->guard()->factory()->getTTL() * 60,
                'user' => $this->guard()->user()
            ]
        ]);
    }
}
