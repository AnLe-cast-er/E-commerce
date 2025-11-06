<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;

class OrderController extends Controller
{
    // ✅ Place order (COD)
    public function placeOrder(Request $request)
    {
        $items = $request->items;
        $amount = $request->amount;
        $address = $request->address;
        $method = strtoupper($request->method ?? 'COD');

        if (!$items || count($items) == 0) {
            return response()->json(["success" => false, "message" => "No items in order"], 400);
        }

        if (!$amount || $amount <= 0) {
            return response()->json(["success" => false, "message" => "Invalid amount"], 400);
        }

        if (!$address || empty($address['fullName']) || empty($address['phone']) || empty($address['address'])) {
            return response()->json(["success" => false, "message" => "Missing delivery info"], 400);
        }

        $orderData = [
            "user_id" => $request->user->id,
            "items" => array_map(function ($item) {
                return [
                    "product_id" => $item["productId"] ?? $item["_id"] ?? null,
                    "name" => $item["name"] ?? "",
                    "price" => $item["price"] ?? 0,
                    "size" => $item["size"] ?? "",
                    "quantity" => $item["quantity"] ?? 1,
                    "image" => $item["image"] ?? ""
                ];
            }, $items),
            "address" => [
                "fullName" => $address["fullName"],
                "email" => $address["email"] ?? "",
                "phone" => $address["phone"],
                "address" => $address["address"]
            ],
            "amount" => $amount,
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

    // ✅ for VNPay (Frontend call before redirect)
    public function placeOrderVnpay(Request $request)
    {
        return response()->json([
            "success" => true,
            "message" => "Now call VNPay URL API"
        ]);
    }

    // ✅ Admin get all orders
    public function allOrders()
    {
        $orders = Order::orderBy("created_at", "DESC")->get();
        return response()->json(["success" => true, "orders" => $orders]);
    }

    // ✅ User get own orders
    public function userOrders(Request $request)
    {
        $orders = Order::where("user_id", $request->user->id)
            ->orderBy("created_at", "DESC")
            ->get();

        return response()->json(["success" => true, "orders" => $orders]);
    }

    // ✅ Admin update order status
    public function updateStatus(Request $request)
    {
        $orderId = $request->orderId;
        $status = $request->status;

        $valid = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!in_array($status, $valid)) {
            return response()->json([
                "success" => false,
                "message" => "Invalid status"
            ], 400);
        }

        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(["success" => false, "message" => "Order not found"], 404);
        }

        $order->status = $status;
        $order->save();

        return response()->json(["success" => true, "message" => "Updated", "order" => $order]);
    }
}
