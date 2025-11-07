<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.productId' => 'required|integer|exists:products,id',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'nullable|string',
            'items.*.image' => 'nullable|string',

            'amount' => 'required|numeric|min:1',

            'address.fullName' => 'required|string|max:255',
            'address.phone' => 'required|string|max:15',
            'address.address' => 'required|string|max:255',
            'address.email' => 'nullable|email',

            'method' => 'nullable|string|in:COD,VNPAY'
        ];
    }

    public function messages()
    {
        return [
            'items.required' => 'Order must contain at least one item',
            'address.fullName.required' => 'Full name is required',
        ];
    }
}
