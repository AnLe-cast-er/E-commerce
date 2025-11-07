<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class AddToCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'itemId' => 'required|integer|exists:products,id',
            'size' => 'required|string|max:10'
        ];
    }

    public function messages(): array
    {
        return [
            'itemId.required' => 'Sản phẩm không được trống',
            'itemId.exists' => 'Sản phẩm không tồn tại',
            'size.required' => 'Vui lòng chọn size'
        ];
    }
}
