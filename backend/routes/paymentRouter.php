<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

Route::prefix('payment')->group(function () {

    // Dành cho người dùng web/session
    Route::middleware('auth.user')->group(function () {
        Route::post('/create_payment_url', [PaymentController::class, 'createPaymentUrl']);
        Route::post('/create-vnpay-url', [PaymentController::class, 'createPaymentUrl']);
    });

    // Dành cho API token
    Route::middleware('auth:api')->group(function () {
        Route::post('/create_payment_url', [PaymentController::class, 'createPaymentUrl']);
    });
});