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
    // 🛒 Thêm sản phẩm vào giỏ
    public function add(AddToCartRequest $request) // Sử dụng AddToCartRequest
    {
        $user = $request->user();
        $validated = $request->validated();
        
        $itemId = $validated['itemId'];
        $size   = $validated['size'];

        // Validation 'exists' đảm bảo Product tồn tại, chỉ cần tìm
        $product = Product::find($itemId);

        // Lấy giỏ hàng an toàn
        $cart = $user->cartData ?? [];

        // Khởi tạo sản phẩm trong giỏ nếu chưa tồn tại
        if (!isset($cart[$itemId])) {
            $cart[$itemId] = [
                "product" => [
                    // Dùng $product->id (ObjectId)
                    "_id"   => $product->id, 
                    "name"  => $product->name,
                    "price" => $product->price,
                    "image" => $product->image
                ],
                "sizes" => []
            ];
        }

        // Khởi tạo size nếu chưa tồn tại
        if (!isset($cart[$itemId]["sizes"][$size])) {
            $cart[$itemId]["sizes"][$size] = 0;
        }

        $cart[$itemId]["sizes"][$size]++;

        $user->cartData = $cart;
        $user->save();

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
                $product = Product::find($itemId);
                
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
        $user->save();

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
        $user->save();

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