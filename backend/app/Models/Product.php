<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;
use App\Models\Traits\MongoSchema;

class Product extends Model
{
    use HasFactory,MongoSchema;

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
    public static function boot()
    {
        parent::boot();

        static::creating(function () {
            static::applyMongoSchema('products');
        });
    }
}