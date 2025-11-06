<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Order;

class PaymentController extends Controller
{
    // ================================
    // ✅ CREATE PAYMENT URL
    // ================================
    public function createPaymentUrl(Request $request)
    {
        $request->validate([
            'orderId' => 'required',
        ]);

        $orderId = $request->orderId;
        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = env('FRONTEND_URL') . "/vnpay-return";
        $vnp_TmnCode = env('VNP_TMN_CODE');
        $vnp_HashSecret = env('VNP_HASH_SECRET');

        $vnp_TxnRef = $orderId . "_" . date("YmdHis");
        $vnp_OrderInfo = "Thanh toan don hang " . $orderId;
        $vnp_OrderType = "billpayment";
        $vnp_Amount = $order->amount * 100;
        $vnp_Locale = "vn";
        $vnp_IpAddr = $request->ip();

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef
        );

        if ($request->bankCode) {
            $inputData['vnp_BankCode'] = $request->bankCode;
        }

        ksort($inputData);
        $query = "";
        $hashdata = "";

        foreach ($inputData as $key => $value) {
            $hashdata .= ($hashdata ? '&' : '') . urlencode($key) . "=" . urlencode($value);
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        
        if ($vnp_HashSecret) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= "vnp_SecureHash=" . $vnpSecureHash;
        }

        return response()->json([
            'success' => true,
            'paymentUrl' => $vnp_Url
        ]);
    }

    // ================================
    // ✅ VNPAY RETURN
    // ================================
    public function vnpayReturn(Request $request)
    {
        $vnp_SecureHash = $request->vnp_SecureHash;
        $inputData = $request->except('vnp_SecureHash', 'vnp_SecureHashType');

        ksort($inputData);
        $hashData = urldecode(http_build_query($inputData));
        $vnp_HashSecret = env('VNP_HASH_SECRET');
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        $orderCode = explode("_", $request->vnp_TxnRef)[0]; 
        $order = Order::find($orderCode);

        if (!$order) {
            return response("Order not found", 404);
        }

        if ($secureHash === $vnp_SecureHash) {
            if ($request->vnp_ResponseCode == '00') {
                $order->update([
                    'payment' => true,
                    'status' => 'Processing'
                ]);
            } else {
                $order->update([
                    'payment' => false,
                    'status' => 'Payment Failed'
                ]);
            }

            return redirect(env('FRONTEND_URL') . "/vnpay-return?vnp_ResponseCode={$request->vnp_ResponseCode}&vnp_TxnRef={$orderCode}");
        }

        return response("Invalid signature", 400);
    }
}
