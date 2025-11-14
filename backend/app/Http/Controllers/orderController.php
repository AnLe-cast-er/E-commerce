<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Requests\Order\PlaceOrderRequest;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
use Illuminate\Support\Facades\Log;
use MongoDB\BSON\ObjectId;

class OrderController extends Controller
{



    public function placeOrder(PlaceOrderRequest $request)
    {
        $validated = $request->validated();
        $method = strtoupper($validated['method'] ?? 'COD');

        $authenticatedUser = $request->user(); 

        if (!$authenticatedUser) {
            return response()->json(["success" => false, "message" => "Unauthenticated"], 401);
        }

        $orderData = [
            "userId" => new ObjectId($authenticatedUser->id), 
            
            "items" => array_map(function ($item) {
                return [
                    "productId" => new ObjectId($item["productId"]), 
                    "name" => $item["name"],
                    "price" => (float) $item["price"],
                    "size" => $item["size"] ?? "",
                    "quantity" => (int) $item["quantity"],
                    "image" => $item["image"] ?? ""
                ];
            }, $validated['items']),
            
            "address" => $validated['address'],
            "amount" => (float) $validated['amount'],
            
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
            $userIdString = (string) $user->id;
            $userIdObjectId = new ObjectId($userIdString);
            $orders = Order::where('userId', $userIdObjectId)
                ->orderBy('date', 'desc')
                ->get();


            return response()->json([
                'success' => true,
                'orders' => $orders
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Internal server error'
            ], 500);
        }
    }


    public function allOrders(Request $request)
    {
        try {
            Log::info('Accessing allOrders endpoint');
            $orders = Order::orderBy('date', 'desc')->get();
            Log::info('Orders fetched: ' . count($orders));
            return response()->json([
                'success' => true,
                'orders' => $orders
            ]);

        } catch (\Exception $e) {
            
            return response()->json([
                'success' => false,
                'message' => 'Internal server error fetching all orders'
            ], 500);
        }
    }

}