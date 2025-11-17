<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Traits\MongoSchema; 

return new class extends Migration
{

    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $collection) {
            
            $collection->index('category');
            $collection->index('subCategory');
            $collection->index('name');
            $collection->index('bestseller');
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