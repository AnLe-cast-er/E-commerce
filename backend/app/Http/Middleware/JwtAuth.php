<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use App\Models\User;
class JwtAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['success' => false, 'message' => 'No token provided'], 401);
        }

        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));

            $user = User::find($decoded->id); 
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'User not found'], 404);
            }
            $request->setUserResolver(function () use ($user) {
                return $user;
            });
            $request->attributes->set('user', $user); 
            
            $request->merge(['user_id' => $decoded->id]);

        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Invalid token'], 401);
        }

        return $next($request);
    }
}
