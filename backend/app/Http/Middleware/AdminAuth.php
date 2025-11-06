<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User;
class AdminAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('Authorization');

        if (!$token || !str_starts_with($token, 'Bearer ')) {
            return response()->json(['success' => false, 'message' => 'No authentication token provided'], 401);
        }

        $token = substr($token, 7); // remove "Bearer "

        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));

            if (empty($decoded->isAdmin) || $decoded->isAdmin !== true) {
                return response()->json(['success' => false, 'message' => 'Unauthorized access'], 403);
            }

            $request->attributes->set('auth', $decoded);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired token'], 401);
        }

        return $next($request);
    }
}
