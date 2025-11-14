<?php

namespace App\Http\Requests\Product;


use Illuminate\Foundation\Http\FormRequest;


class AddProductRequest extends FormRequest
{
public function authorize(): bool { return true; }
public function rules(): array
    {
    return [
        'name' => 'required|string',
        'price' => 'required|numeric',
        'image' => 'required|array|min:1',
        'description' => 'nullable|string',
        'category' => 'required|string',
        'subCategory' => 'nullable|string',
        'sizes' => 'nullable|array',
        'bestseller' => 'nullable|boolean'
        ];
    }
}