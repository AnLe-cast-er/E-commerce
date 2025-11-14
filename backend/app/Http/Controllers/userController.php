<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\RegisterUserRequest;
use App\Http\Requests\User\LoginUserRequest;
use App\Http\Requests\User\AdminLoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use MongoDB\BSON\ObjectId;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    private function createToken($id)
    {
        return JWT::encode(
            ['id' => $id, 'exp' => time() + 60*60*24],
            env('JWT_SECRET'),
            'HS256'
        );
    }

    public function registerUser(RegisterUserRequest $request)
    {
        try{
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'token' => $this->createToken($user->id)
        ]);
    }catch(Exception $e){
        Log::error('Failed to register user', [
            'error' => $e->getMessage(),
            'data' => $request->all()
        ]);
        return response()->json([
            'success' => false,
            'message' => 'Failed to register user' 
        ], 500);
    }
    }

    public function loginUser(LoginUserRequest $request)
{
    try{
    $user = User::where('email', $request->email)->first();
    }catch(Exception $e){
        Log::error('Failed to login user', [
            'error' => $e->getMessage(),
            'data' => $request->all()
        ]);
        return response()->json([
            'success' => false,
            'message' => 'Failed to login user' 
        ], 500);
    }
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['success' => false, 'message' => "Invalid credentials"]);
    }

    return response()->json([
        'success' => true,
        'token' => $this->createToken((string) $user->id) 
    ]);
}

public function adminLogin(AdminLoginRequest $request)
{
    try{
    $user = User::where('email', $request->email)->first();
    }catch(Exception $e){
        Log::error('Failed to login admin', [
            'error' => $e->getMessage(),
            'data' => $request->all()
        ]);
        return response()->json([
            'success' => false,
            'message' => 'Failed to login admin' 
        ], 500);
    }

    if (!$user || !Hash::check($request->password, $user->password) || !$user->is_admin) {
        return response()->json(['success' => false, 'message' => 'Invalid admin credentials']);
    }
    $token = JWT::encode(
        ['id' => (string) $user->_id, 'isAdmin' => true, 'exp' => time() + 86400],
        env('JWT_SECRET'),
        'HS256'
    );

    return response()->json(['success' => true, 'token' => $token]);
}

public function getUserProfile(Request $request)
{
    $token = $request->bearerToken();
    $jwtSecret = env('JWT_SECRET');

    if (!$token || !$jwtSecret) {
        return response()->json([
            'success' => false,
            'message' => 'Token not provided or secret missing'
        ], 401);
    }

    try {

    $decoded = JWT::decode($token, new Key($jwtSecret, 'HS256'));
    $userId = $decoded->id ?? null; 

    if (!$userId) {
        return response()->json(['success' => false, 'message' => 'Invalid token payload'], 401);
    }

        $userObjectId = new ObjectId($userId);
        try{
        $user = User::find($userObjectId);
        }catch(Exception $e){
            Log::error('Failed to find user', [
                'error' => $e->getMessage(),
                'user_id' => $userId
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to find user' 
            ], 500);
        }

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        return response()->json([
            'success' => true,
            'user' => $user
        ]);

    }catch (Exception $e) { 
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
                'error' => $e->getMessage()
            ], 401);
        }
    }
    
}