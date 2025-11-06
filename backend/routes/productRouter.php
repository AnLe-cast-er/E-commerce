<?php

use App\Http\Controllers\ProductController;
use App\Http\Middleware\AdminAuthMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware(['admin.auth'])->group(function () {
    Route::post('/product/add', [ProductController::class, 'addProduct']);
    Route::post('/product/remove', [ProductController::class, 'removeProduct']);
    Route::put('/product/update/{id}', [ProductController::class, 'updateProduct']);
});

Route::get('/product/list', [ProductController::class, 'listProducts']);
Route::get('/product/{productId}', [ProductController::class, 'singleProduct']);
