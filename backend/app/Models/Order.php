<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    
    protected $connection = 'mongodb';

    protected $fillable = [
        'user_id', 
        'items',
        'address',
        'amount',
        'status',
        'paymentMethod',
        'payment',
        'date'
    ];

    protected $casts = [
        'items' => 'array',    
        'address' => 'array',   
        'payment' => 'boolean',
        'amount' => 'float',
        'date' => 'datetime'
    ];

    public function user()
    {
        // Vẫn dùng User::class sau khi đã fix
        return $this->belongsTo(User::class, 'user_id'); 
    }
}