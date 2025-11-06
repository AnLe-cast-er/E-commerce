<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        
        $table->unsignedBigInteger('userId'); // FK user

        $table->json('items'); // Mảng sản phẩm

        $table->json('address'); // object địa chỉ

        $table->decimal('amount', 10, 2);

        $table->enum('status', [
            'Order Placed', 
            'Processing', 
            'Shipped', 
            'Delivered', 
            'Cancelled'
        ])->default('Order Placed');

        $table->enum('paymentMethod', ['COD', 'VNPAY'])->default('COD');

        $table->boolean('payment')->default(false);

        $table->timestamp('date')->useCurrent();

        $table->timestamps();

        // foreign key
        $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
