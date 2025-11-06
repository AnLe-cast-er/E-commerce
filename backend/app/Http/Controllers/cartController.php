<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // 🛒 Thêm vào giỏ hàng
    public function add(Request $request)
    {
        $userId = $request->user->id;
        $itemId = $request->itemId;
        $size = $request->size;

        if (!$itemId || !$size) {
            return response()->json(["success" => false, "message" => "Thiếu dữ liệu"], 400);
        }

        $product = Product::find($itemId);
        if (!$product) return response()->json(["success" => false, "message" => "Không tìm thấy sản phẩm"], 404);

        $user = User::find($userId);
        $cart = $user->cartData ?? [];

        if (!isset($cart[$itemId])) {
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

        if (!isset($cart[$itemId]["sizes"][$size])) {
            $cart[$itemId]["sizes"][$size] = 0;
        }

        $cart[$itemId]["sizes"][$size]++;

        $user->cartData = $cart;
        $user->save();

        return response()->json(["success" => true, "cartData" => $cart, "message" => "Đã thêm vào giỏ"]);
    }

    // 📝 Update giỏ hàng
    public function update(Request $request)
    {
        $userId = $request->user->id;
        $itemId = $request->itemId;
        $size = $request->size;
        $quantity = $request->quantity;

        $user = User::find($userId);
        $cart = $user->cartData ?? [];

        if ($quantity <= 0) {
            unset($cart[$itemId]["sizes"][$size]);
            if (empty($cart[$itemId]["sizes"])) unset($cart[$itemId]);
        } else {
            if (!isset($cart[$itemId])) {
                $product = Product::find($itemId);
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

        return response()->json(["success" => true, "cartData" => $cart, "message" => "Cập nhật thành công"]);
    }

    // ❌ Xóa khỏi giỏ
    public function remove(Request $request)
    {
        $userId = $request->user->id;
        $itemId = $request->itemId;
        $size = $request->size;

        $user = User::find($userId);
        $cart = $user->cartData ?? [];

        unset($cart[$itemId]["sizes"][$size]);
        if (empty($cart[$itemId]["sizes"])) unset($cart[$itemId]);

        $user->cartData = $cart;
        $user->save();

        return response()->json(["success" => true, "cartData" => $cart, "message" => "Đã xóa"]);
    }

    // 📦 Lấy giỏ hàng
    public function get(Request $request)
    {
        $userId = $request->user->id;
        $user = User::find($userId);

        return response()->json([
            "success" => true,
            "cartData" => $user->cartData ?? [],
            "message" => "Lấy giỏ hàng thành công"
        ]);
    }
}
