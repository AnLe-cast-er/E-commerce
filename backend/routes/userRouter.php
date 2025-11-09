<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController; 


Route::prefix('user')->group(function () { 

    Route::post('/register', [UserController::class, 'registerUser']); 
    Route::post('/login', [UserController::class, 'loginUser']);
    Route::post('/admin', [UserController::class, 'adminLogin']);
    
    Route::middleware('auth:sanctum')->get('/profile', [UserController::class, 'getUserProfile']);


});