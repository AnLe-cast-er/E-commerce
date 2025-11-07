<?php

namespace App\Http\Requests\Product;


use Illuminate\Foundation\Http\FormRequest;


class UpdateProductRequest extends FormRequest
{
public function authorize(): bool { return true; }
public function rules(): array
{
return [
'name' => 'nullable|string',
'price' => 'nullable|numeric',
'image' => 'nullable|array',
'description' => 'nullable|string',
'category' => 'nullable|string',
'subCategory' => 'nullable|string',
'sizes' => 'nullable|array',
'bestseller' => 'nullable|boolean'
];
}
}