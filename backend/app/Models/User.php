<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Jenssegers\Mongodb\Eloquent\Model as MongoModel;
class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'password', 'cartData'];

    protected $casts = [
        'cartData' => 'array',
    ];
}
