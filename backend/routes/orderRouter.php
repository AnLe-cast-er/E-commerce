<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController; 

Route::middleware(['admin.auth'])->prefix('order')->group(function () {
    Route::post('/all', [OrderController::class, 'allOrders']);
    Route::patch('/status', [OrderController::class, 'updateStatus']);
});

Route::middleware(['auth.user'])->prefix('order')->group(function () {
    Route::post('/place', [OrderController::class, 'placeOrder']);
    Route::post('/vnpay', [OrderController::class, 'placeOrderVnpay']);
    Route::get('/userorders', [OrderController::class, 'userOrders']);
});
