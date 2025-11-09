<?php

namespace App\Http\Requests\Product;


use Illuminate\Foundation\Http\FormRequest;


class UpdateProductRequest extends FormRequest
{
public function authorize(): bool { return true; }

public function rules(): array
{
    return [
        'name' => 'nullable|string|max:255',
        'price' => 'nullable|numeric|min:0.01',
        'image' => 'nullable|array',
        'image.*' => 'string|url', 
        'description' => 'nullable|string',
        'category' => 'nullable|string',
        'subCategory' => 'nullable|string',
        'sizes' => 'nullable|array',
        'sizes.*' => 'string|max:10', 
        'bestseller' => 'nullable|boolean',
        'date' => 'nullable|integer'
    ];
}
}