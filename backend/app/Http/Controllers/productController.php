<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\AddProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Requests\Product\SingleProductRequest;
use App\Http\Requests\Product\RemoveProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function addProduct(AddProductRequest $request): JsonResponse
    {
        $data = $request->validated();

        $product = Product::create($data);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }

   public function updateProduct(UpdateProductRequest $request, string $id): JsonResponse
    {
        $data = $request->validated();
        
        $product = Product::findOrFail($id); 
        
        $product->update($data);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    public function singleProduct(string $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        return response()->json([
            'data' => $product
        ]);
    }
    public function listProducts()
    {
        $products = Product::all();

        return response()->json([
            'success' => true,
            'products' => $products
        ]);
    }


    public function removeProduct(string $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product removed successfully'
        ]);
    }
}