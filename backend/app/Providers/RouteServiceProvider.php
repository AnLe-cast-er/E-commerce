<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
{
    $this->routes(function () {

        // Default API file
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        // ✅ Load custom API routes
        $files = [
            'userRouter.php',
            'productRouter.php',
            'cartRouter.php',
            'orderRouter.php',
            'paymentRouter.php',
        ];

        foreach ($files as $file) {
            Route::middleware(['api', 'throttle:120,1'])
                ->prefix('api')
                ->group(base_path("routes/$file"));
        }

        // Web routes
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    });
}

}
