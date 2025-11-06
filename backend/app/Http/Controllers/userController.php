<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

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

    public function registerUser(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $this->createToken($user->id);

        return response()->json(['success' => true, 'token' => $token]);
    }

    public function loginUser(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['success' => false, 'message' => "Invalid credentials"]);
        }

        $token = $this->createToken($user->id);

        return response()->json(['success' => true, 'token' => $token]);
    }

    public function getUserProfile(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user
        ]);
    }

    public function adminLogin(Request $request)
    {
        if (
            $request->email != env('ADMIN_EMAIL') ||
            $request->password != env('ADMIN_PASSWORD')
        ) {
            return response()->json(['success' => false, 'message' => 'Invalid admin credentials']);
        }

        $token = JWT::encode(
            ['email' => $request->email, 'isAdmin' => true, 'exp' => time() + 86400],
            env('JWT_SECRET'),
            'HS256'
        );

        return response()->json(['success' => true, 'token' => $token]);
    }
}
