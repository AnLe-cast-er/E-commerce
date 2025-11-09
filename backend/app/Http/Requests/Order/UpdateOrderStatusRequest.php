<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Order;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'orderId' => 'required|string|exists:orders,_id', 
            'status' => 'required|string|in:' . implode(',', Order::STATUS_ENUM) 
        ];
    }
}
