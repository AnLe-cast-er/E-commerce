<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\UpdateCartRequest;
use App\Http\Requests\Cart\RemoveCartRequest;

class CartController extends Controller
{
    // Add to card
    public function add(AddToCartRequest $request) 
    {
        $user = $request->user();
        $validated = $request->validated();
        
        $itemId = $validated['itemId'];
        $size   = $validated['size'];

       try{
        $product = Product::find($itemId);
       }catch(Exception $e){
        Log::error('Failed to find product for cart', [
                'error' => $e->getMessage(),
                'item_id' => $itemId
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to find product for cart' 
            ], 500);
       }
        
        $cart = $user->cartData ?? [];

        
        if (!isset($cart[$itemId])) {
            $cart[$itemId] = [
                "product" => [
                    // Use $product->id (ObjectId)
                    "_id"   => $product->id, 
                    "name"  => $product->name,
                    "price" => $product->price,
                    "image" => $product->image
                ],
                "sizes" => []
            ];
        }


        if (!isset($cart[$itemId]["sizes"][$size])) {
            $cart[$itemId]["sizes"][$size] = 0;
        }

        $cart[$itemId]["sizes"][$size]++;

        $user->cartData = $cart;
        try{
        $user->save();
        }catch(Exception $e){
            Log::error('Failed to save cart', [
                'error' => $e->getMessage(),
                'data' => $cart
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to save cart' 
            ], 500);
        }

        return response()->json([
            "success" => true,
            "cartData" => $cart,
            "message" => "Added to cart"
        ]);
    }


    public function update(UpdateCartRequest $request) 
    {
        $user     = $request->user();
        $validated = $request->validated();
        
        $itemId   = $validated['itemId'];
        $size     = $validated['size'];
        $quantity = $validated['quantity'];

        $cart = $user->cartData ?? [];


        if ($quantity <= 0) {
            if (isset($cart[$itemId]["sizes"][$size])) {
                unset($cart[$itemId]["sizes"][$size]);
                if (empty($cart[$itemId]["sizes"])) unset($cart[$itemId]);
            }
        } else {
            if (!isset($cart[$itemId])) {
                try{
                $product = Product::find($itemId);
                }catch(Exception $e){
                    Log::error('Failed to find product for cart', [
                        'error' => $e->getMessage(),
                        'item_id' => $itemId
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to find product for cart' 
                    ], 500);
                }
                if (!$product) {
                    return response()->json(["success" => false, "message" => "No products found"], 404);
                }

                $cart[$itemId] = [
                    "product" => [
                        "_id" => $product->id,
                        "name" => $product->name,
                        "price" => $product->price,
                        "image" => $product->image
                    ],
                    "sizes" => []
                ];
            }

            $cart[$itemId]["sizes"][$size] = $quantity;
        }

        $user->cartData = $cart;
        try{
        $user->save();
        }catch(Exception $e){
            Log::error('Failed to save cart', [
                'error' => $e->getMessage(),
                'data' => $cart
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to save cart' 
            ], 500);
        }

        return response()->json([
            "success" => true,
            "cartData" => $cart,
            "message" => "Update successfully"
        ]);
    }

    public function remove(RemoveCartRequest $request) 
    {
        $user = $request->user();
        $validated = $request->validated();
        
        $itemId = $validated['itemId'];
        $size   = $validated['size'];

        $cart = $user->cartData ?? [];
        

        if (isset($cart[$itemId]["sizes"][$size])) {
            unset($cart[$itemId]["sizes"][$size]);
            if (empty($cart[$itemId]["sizes"])) unset($cart[$itemId]);
        }

        $user->cartData = $cart;
        try{
        $user->save();
        }catch(Exception $e){
            Log::error('Failed to save cart', [
                'error' => $e->getMessage(),
                'data' => $cart
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to save cart' 
            ], 500);
        }

        return response()->json([
            "success" => true,
            "cartData" => $cart,
            "message" => "Deleted successfully"
        ]);
    }

    public function get(Request $request)
    {
        $user = $request->user();

        return response()->json([
            "success" => true,
            "cartData" => $user->cartData ?? [],
            "message" => "Get cart successfully"
        ]);
    }
}