<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Carbon; 

class ProductController extends Controller
{

    public function addProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'required|array'
        ]);

        $images = $request->image; 

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description ?? '',
            'category' => $request->category ?? 'Men',
            'subCategory' => $request->subCategory ?? 'Topwear', 
            'price' => $request->price,
            'sizes' => $request->sizes, 
            'bestseller' => $request->bestseller == "true" ? true : false, 
            'image' => $images, 
            'date' => time(), 
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product added successfully',
            'product' => $product
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

   
    public function removeProduct(Request $request)
    {
        
        Product::where('_id', $request->productId)->delete(); 

        return response()->json([
            'success' => true,
            'message' => 'Product removed successfully'
        ]);
    }

    
    public function singleProduct(Request $request)
    {
        
        $product = Product::find($request->productId); 

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        return response()->json(['success' => true, 'product' => $product]);
    }

    
    public function updateProduct(Request $request, $id)
    {
      
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        $product->update([
            'name' => $request->name ?? $product->name,
            'description' => $request->description ?? $product->description,
            'price' => $request->price ?? $product->price,
            'category' => $request->category ?? $product->category,
            'subCategory' => $request->subCategory ?? $product->subCategory, 
            'sizes' => $request->sizes ? $request->sizes : $product->sizes, 
            'bestseller' => $request->bestseller == "true" ? true : false, 
            'image' => $request->image ? $request->image : $product->image, 
            'date' => time(), 
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }
}