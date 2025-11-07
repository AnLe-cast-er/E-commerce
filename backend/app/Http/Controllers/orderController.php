<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use App\Http\Requests\Order\PlaceOrderRequest;
use App\Http\Requests\Order\UpdateOrderStatusRequest;

class OrderController extends Controller
{
    public function placeOrder(PlaceOrderRequest $request)
    {
        $validated = $request->validated();
        $method = strtoupper($validated['method'] ?? 'COD');

        $orderData = [
            "user_id" => $request->user->id,
            "items" => array_map(function ($item) {
                return [
                    "product_id" => $item["productId"],
                    "name" => $item["name"],
                    "price" => $item["price"],
                    "size" => $item["size"] ?? "",
                    "quantity" => $item["quantity"],
                    "image" => $item["image"] ?? ""
                ];
            }, $validated['items']),
            "address" => $validated['address'],
            "amount" => $validated['amount'],
            "payment_method" => $method,
            "payment" => $method === "COD",
            "status" => $method === "VNPAY" ? "Pending Payment" : "Order Placed",
            "date" => Carbon::now()
        ];

        $order = Order::create($orderData);

        if ($method === "COD") {
            User::where("id", $request->user->id)->update(["cartData" => []]);
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
}
