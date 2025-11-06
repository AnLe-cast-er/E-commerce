<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User;
class AuthUser
{
    public function handle(Request $request, Closure $next)
    {
        $authHeader = $request->header('Authorization') ?? $request->header('token');

        if (!$authHeader) {
            return response()->json(['success' => false, 'message' => 'No token provided'], 401);
        }

        $token = str_starts_with($authHeader, 'Bearer ')
            ? substr($authHeader, 7)
            : $authHeader;

        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));

            $user = User::find($decoded->id); 

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'User not found'], 404);
            }

            // 2. Gán đối tượng User đầy đủ bằng phương thức chuẩn của Laravel
            $request->setUserResolver(fn () => $user); 
            
            // 3. (Optional) Gán ID vào body để tiện sử dụng
            $request->merge(['user_id' => $decoded->id]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Invalid token'], 401);
        }

        return $next($request);
    }
}
