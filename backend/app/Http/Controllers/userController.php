<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\RegisterUserRequest;
use App\Http\Requests\User\LoginUserRequest;
use App\Http\Requests\User\AdminLoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;

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
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'token' => $this->createToken($user->id)
        ]);
    }

    public function loginUser(LoginUserRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['success' => false, 'message' => "Invalid credentials"]);
        }

        return response()->json([
            'success' => true,
            'token' => $this->createToken($user->id)
        ]);
    }

    public function adminLogin(AdminLoginRequest $request)
{
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password) || !$user->is_admin) {
        return response()->json(['success' => false, 'message' => 'Invalid admin credentials']);
    }

    $token = JWT::encode(
        ['id' => $user->_id, 'isAdmin' => true, 'exp' => time() + 86400],
        env('JWT_SECRET'),
        'HS256'
    );

    return response()->json(['success' => true, 'token' => $token]);
}

    
}