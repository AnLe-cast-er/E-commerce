<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController; // Phải import Controller của bạn


Route::middleware(['auth.user'])->group(function () { 
    
    Route::post('/payment/create_payment_url', [PaymentController::class, 'createPaymentUrl']);


    Route::post('/payment/create-vnpay-url', [PaymentController::class, 'createPaymentUrl']);
});

Route::get('/payment/vnpay_return', [PaymentController::class, 'vnpayReturn']);