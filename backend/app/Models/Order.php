<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

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
        'items' => 'array',    
        'address' => 'array',   
        'payment' => 'boolean',
        'amount' => 'float',
        'date' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
