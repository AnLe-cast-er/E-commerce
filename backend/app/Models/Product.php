<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $collection = 'products';
    protected $connection = 'mongodb';

    protected $fillable = [
        'name',
        'description',
        'price',
        'image',
        'category',
        'subCategory',
        'sizes',
        'bestseller',
        'date'
    ];

    protected $casts = [       
        'bestseller' => 'boolean',
        'date' => 'integer',     
    ];
}