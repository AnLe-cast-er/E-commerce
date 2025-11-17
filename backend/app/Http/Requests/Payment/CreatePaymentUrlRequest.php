<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePaymentUrlRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'orderId' => 'required|string|exists:orders,_id', 
            'bankCode' => 'nullable|string'
        ];
    }


    public function messages(): array
    {
        return [
            'orderId.required' => 'Order ID is required.',
            'orderId.exists' => 'Order not found.',
            'bankCode.string' => 'Bank code must be a character string'
        ];
    }
}