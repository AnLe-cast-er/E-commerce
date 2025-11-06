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
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('description');
        $table->decimal('price', 10, 2);
        
        // Mongoose: image: array --> Laravel: JSON
        $table->json('image')->nullable();
        
        $table->string('category');
        $table->string('subCategory');

        // sizes: array --> JSON
        $table->json('sizes')->nullable();

        $table->boolean('bestseller')->default(false);

        // Mongoose: date (number timestamp)
        $table->bigInteger('date');

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
