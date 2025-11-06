<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController; // Phải import Controller của bạn

Route::middleware(['admin.auth'])->group(function () {

    Route::get('/orders/list', [OrderController::class, 'allOrders']);
    
    Route::patch('/orders/status', [OrderController::class, 'updateStatus']);
});

Route::middleware(['auth.user'])->group(function () {
    
    Route::post('/orders/place', [OrderController::class, 'placeOrder']);
    Route::post('/orders/vnpay', [OrderController::class, 'placeOrderVnpay']);
    Route::get('/orders/userorders', [OrderController::class, 'userOrders']);
});