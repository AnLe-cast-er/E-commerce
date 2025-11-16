<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\UpdateCartRequest;
use App\Http\Requests\Cart\RemoveCartRequest;
use Illuminate\Support\Facades\Log;
use MongoDB\BSON\ObjectId;
use Exception;

class CartController extends Controller
{
    // Add to cart
    public function add(AddToCartRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        $productId = $validated['itemId']; // từ request
        $size = $validated['size'];
        $quantity = (int)($validated['quantity'] ?? 1);

        try {
            $product = Product::find($productId);
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }
        } catch(Exception $e) {
            Log::error('Failed to find product for cart', [
                'error' => $e->getMessage(),
                'productId' => $productId
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to find product'
            ], 500);
        }

        $cart = $user->cartData ?? [];
        $found = false;

        foreach ($cart as &$item) {
            if ((string)$item['productId'] === (string)$productId) {
                // check if size exists
                $sizeFound = false;
                foreach ($item['sizes'] as &$s) {
                    if ($s['size'] === $size) {
                        $s['quantity'] += $quantity;
                        $sizeFound = true;
                        break;
                    }
                }
                unset($s);
                if (!$sizeFound) {
                    $item['sizes'][] = [
                        'size' => $size,
                        'quantity' => $quantity
                    ];
                }

                // update total quantity
                $item['quantity'] = array_sum(array_column($item['sizes'], 'quantity'));
                $found = true;
                break;
            }
        }
        unset($item);

        if (!$found) {
            $cart[] = [
                'productId' => new ObjectId($productId),
                'quantity' => $quantity,
                'sizes' => [
                    [
                        'size' => $size,
                        'quantity' => $quantity
                    ]
                ]
            ];
        }

        $user->cartData = $cart;

        try {
            $user->save();
        } catch(Exception $e) {
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
            'success' => true,
            'cartData' => $cart,
            'message' => 'Added to cart'
        ]);
    }

    // Update cart
    public function update(UpdateCartRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        $productId = $validated['itemId'];
        $quantity = (int)$validated['quantity'];
        $size = $validated['size'] ?? null; // optional, nếu muốn update theo size

        $cart = $user->cartData ?? [];
        $found = false;

        foreach ($cart as &$item) {
            if ((string)$item['productId'] === (string)$productId) {
                $found = true;

                if ($size) {
                    // update specific size
                    foreach ($item['sizes'] as &$s) {
                        if ($s['size'] === $size) {
                            if ($quantity <= 0) {
                                $item['sizes'] = array_filter($item['sizes'], fn($x) => $x['size'] !== $size);
                            } else {
                                $s['quantity'] = $quantity;
                            }
                            break;
                        }
                    }
                    unset($s);
                } else {
                    // update total quantity (fallback)
                    $item['quantity'] = $quantity;
                }

                // cập nhật lại tổng quantity
                $item['quantity'] = array_sum(array_column($item['sizes'], 'quantity'));

                // nếu hết size, remove item
                if (empty($item['sizes'])) {
                    $cart = array_filter($cart, fn($i) => (string)$i['productId'] !== (string)$productId);
                }

                break;
            }
        }
        unset($item);

        if (!$found && $quantity > 0) {
            $cart[] = [
                'productId' => new ObjectId($productId),
                'quantity' => $quantity,
                'sizes' => [
                    [
                        'size' => $size ?? 'default',
                        'quantity' => $quantity
                    ]
                ]
            ];
        }

        $user->cartData = array_values($cart);

        try {
            $user->save();
        } catch(Exception $e) {
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
            'success' => true,
            'cartData' => $cart,
            'message' => 'Cart updated successfully'
        ]);
    }

    // Remove from cart
    public function remove(RemoveCartRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        $productId = $validated['itemId'];
        $size = $validated['size'] ?? null;

        $cart = $user->cartData ?? [];

        foreach ($cart as &$item) {
            if ((string)$item['productId'] === (string)$productId) {
                if ($size) {
                    $item['sizes'] = array_filter($item['sizes'], fn($s) => $s['size'] !== $size);
                    $item['quantity'] = array_sum(array_column($item['sizes'], 'quantity'));
                } else {
                    $item['sizes'] = [];
                    $item['quantity'] = 0;
                }
                break;
            }
        }
        unset($item);

        // remove items with no sizes
        $cart = array_values(array_filter($cart, fn($i) => !empty($i['sizes'])));

        $user->cartData = $cart;

        try {
            $user->save();
        } catch(Exception $e) {
            Log::error('Failed to remove cart item', [
                'error' => $e->getMessage(),
                'data' => $cart
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove cart item'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'cartData' => $cart,
            'message' => 'Item removed successfully'
        ]);
    }

    // Get cart
    public function get(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'success' => true,
            'cartData' => $user->cartData ?? [],
            'message' => 'Get cart successfully'
        ]);
    }
}
