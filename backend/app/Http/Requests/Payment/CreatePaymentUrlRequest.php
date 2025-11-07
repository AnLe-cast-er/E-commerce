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
            'orderId' => 'required|exists:orders,id',
            'bankCode' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'orderId.required' => 'Order ID là bắt buộc.',
            'orderId.exists' => 'Order không tồn tại.',
            'bankCode.string' => 'Bank code phải là chuỗi ký tự.'
        ];
    }
}
