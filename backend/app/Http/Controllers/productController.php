<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\AddProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Requests\Product\SingleProductRequest;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\Product\RemoveProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Exception;

class ProductController extends Controller
{
    public function addProduct(AddProductRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['date'] = time();
        $data['price'] = (float) $data['price'];
        if (isset($data['bestseller'])) {
            $data['bestseller'] = (bool) $data['bestseller'];
        }
        try{
        $product = Product::create($data);
        }catch(Exception $e){
            Log::error('Failed to create product', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product' 
            ], 500);
        }

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }

   public function updateProduct(UpdateProductRequest $request, string $id): JsonResponse
    {
        $data = $request->validated();

        try {
            $product = Product::findOrFail($id); 
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Product not found'], 404);
        } catch (Exception $e) {
            Log::error('Product update failed: FindOrFail error', [
                'error' => $e->getMessage(),
                'product_id' => $id
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product'
            ], 500);
        }

        // Merge existing + new images
        $existingImages = $data['existing_images'] ?? [];
        $newImages = $data['new_image'] ?? [];
        $data['image'] = array_merge($existingImages, $newImages);

        // Xoá 2 field tạm thời để tránh double update
        unset($data['existing_images'], $data['new_image']);

        try {
            $product->update($data);
        } catch(Exception $e) {
            Log::error('Failed to update product', [
                'error' => $e->getMessage(),
                'product_id' => $id,
                'updated_data' => $data
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product'
            ], 500);
        }

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    public function singleProduct(string $id): JsonResponse
    {
        try{
        $product = Product::findOrFail($id);
        }catch(Exception $e){
            Log::error('Failed to find product', [
                'error' => $e->getMessage(),
                'product_id' => $id
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to find product' 
            ], 500);
        }

        return response()->json([
            'data' => $product
        ]);
    }
    public function listProducts()
    {

        try{
        $products = Product::all();
        }catch(Exception $e){
            Log::error('Product list failed', [
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to list products' 
            ], 500);
        }

        return response()->json([
            'success' => true,
            'products' => $products
        ]);
    }


    public function removeProduct(RemoveProductRequest $request): JsonResponse 
    {
        $validated = $request->validated();
        $productId = $validated['productId'];
        try{
        $product = Product::find($productId);
        }catch(Exception $e){
            Log::error('Failed to find product', [
                'error' => $e->getMessage(),
                'product_id' => $productId
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to find product' 
            ], 500);
        }
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        try{
        $product->delete();
        }catch(Exception $e){
            Log::error('Failed to delete product', [
                'error' => $e->getMessage(),
                'product_id' => $productId
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product' 
            ], 500);
        }

        return response()->json(['message' => 'Product removed successfully']);
    }


}