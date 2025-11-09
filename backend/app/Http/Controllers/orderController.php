<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Requests\Order\PlaceOrderRequest;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
use Illuminate\Support\Facades\Log;


class OrderController extends Controller
{
   
    // OrderController.php (Hàm placeOrder)

    public function placeOrder(PlaceOrderRequest $request)
    {
        $validated = $request->validated();
        $method = strtoupper($validated['method'] ?? 'COD');

        $authenticatedUser = $request->user(); 

        if (!$authenticatedUser) {
            return response()->json(["success" => false, "message" => "Unauthenticated"], 401);
        }

        $orderData = [
            "userId" => $authenticatedUser->id, 
            
            "items" => array_map(function ($item) {
                return [
                    "productId" => $item["productId"], 
                    "name" => $item["name"],
                    "price" => $item["price"],
                    "size" => $item["size"] ?? "",
                    "quantity" => $item["quantity"],
                    "image" => $item["image"] ?? ""
                ];
            }, $validated['items']),
            
            "address" => $validated['address'],
            "amount" => $validated['amount'],
            
            "paymentMethod" => $method, 
            
            "payment" => $method === "COD",

            "status" => $method === "VNPAY" ? \App\Models\Order::STATUS_ENUM[1] : \App\Models\Order::STATUS_ENUM[0], 
            
            "date" => Carbon::now()
        ];

        $order = \App\Models\Order::create($orderData); 

        if ($method === "COD") {
            $authenticatedUser->update(["cartData" => []]); 
        }

        return response()->json([
            "success" => true,
            "message" => "Order placed",
            "order" => $order
        ], 201);
    }

    public function updateStatus(UpdateOrderStatusRequest $request)
    {
        $validated = $request->validated();
        
        $order = Order::find($validated['orderId']); 
        
        $order->status = $validated['status'];
        $order->save();

        return response()->json([
            "success" => true,
            "message" => "Updated",
            "order" => $order
        ]);
    }
    public function userOrders(Request $request)
{
    $user = $request->user();

    if (!$user) {
        return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
    }

    try {
        // Truy vấn đúng field bạn đang dùng: userId
        $orders = Order::where('userId', $user->id)
                        ->orderBy('date', 'desc')
                        ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);

    } catch (\Exception $e) {
        \Log::error("Error fetching user orders for userId {$user->id}: " . $e->getMessage());
        
        return response()->json([
            'success' => false,
            'message' => 'Internal server error'
        ], 500);
    }
}

}