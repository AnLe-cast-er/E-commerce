<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController; // Phải import CartController


Route::middleware(['auth.user'])->group(function () { 
    

    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::get('/cart/get', [CartController::class, 'getUserCart']);
    Route::put('/cart/update', [CartController::class, 'updateCart']);
    Route::delete('/cart/remove', [CartController::class, 'removeFromCart']);
});

