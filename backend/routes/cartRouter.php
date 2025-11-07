<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController; // Phải import CartController


Route::middleware(['auth.user'])->group(function () { 
    

    Route::post('/cart/add', [CartController::class, 'add']);
    Route::get('/cart/get', [CartController::class, 'get']);
    Route::put('/cart/update', [CartController::class, 'update']);
    Route::delete('/cart/remove', [CartController::class, 'remove']);
});

