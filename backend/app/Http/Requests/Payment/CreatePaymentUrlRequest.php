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
            // CHỈNH SỬA: Thêm 'string' và đổi cột kiểm tra từ 'id' sang '_id'
            'orderId' => 'required|string|exists:orders,_id', 
            'bankCode' => 'nullable|string'
        ];
    }

    // Messages giữ nguyên (chính xác)
    public function messages(): array
    {
        return [
            'orderId.required' => 'Order ID là bắt buộc.',
            'orderId.exists' => 'Order không tồn tại.',
            'bankCode.string' => 'Bank code phải là chuỗi ký tự.'
        ];
    }
}