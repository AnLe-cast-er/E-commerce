<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'itemId' => 'required|integer|exists:products,id',
            'size' => 'required|string|max:10',
            'quantity' => 'required|integer|min:0'
        ];
    }
}
