<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'orderId' => 'required|integer|exists:orders,id',
            'status' => 'required|string|in:Order Placed,Processing,Shipped,Delivered,Cancelled'
        ];
    }
}
