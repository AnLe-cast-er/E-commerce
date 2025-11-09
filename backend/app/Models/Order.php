<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'orders'; 

    protected $fillable = [
        'userId', 
        'items',
        'address',
        'amount',
        'status',
        'paymentMethod',
        'payment',
        'date'
    ];

    protected $casts = [   
        'amount' => 'float',     
        'payment' => 'boolean',  
        'date' => 'datetime'     
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    const STATUS_ENUM = ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
    const PAYMENT_METHOD_ENUM = ["COD", "VNPAY"];
}