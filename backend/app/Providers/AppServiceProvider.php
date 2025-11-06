<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Route::middleware('api')
        ->prefix('api')
        ->group(function () {
            require base_path('routes/productRouter.php');
            require base_path('routes/cartRouter.php');
            require base_path('routes/orderRouter.php');
        });
    }
}
