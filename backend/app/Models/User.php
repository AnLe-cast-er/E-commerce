<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model; 
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Model implements AuthenticatableContract
{
    use HasFactory, Authenticatable, HasApiTokens, Notifiable;

    protected $connection = 'mongodb'; 
    protected $collection = 'users';

    protected $fillable = [
        'name',
        'email', 
        'password',
        'cartData'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'cartData' => 'array',
        'email_verified_at' => 'datetime',
    ];
}