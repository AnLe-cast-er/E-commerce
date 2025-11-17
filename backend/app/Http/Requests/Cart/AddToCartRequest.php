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
            'itemId' => 'required|string|exists:products,_id',
            'size' => 'required|string|max:10'
        ];
    }

    public function messages(): array
    {
        return [
            'itemId.required' => 'Product cannot be empty',
            'itemId.exists' => 'Product does not exist',
            'size.required' => 'Please choose size'
        ];
    }
}
