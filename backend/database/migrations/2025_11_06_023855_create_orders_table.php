<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Traits\MongoSchema;
return new class extends Migration
{
    public function up()
{
    Schema::table('orders', function (Blueprint $collection) {
            $collection->index('userId');
            $collection->index('status');
            $collection->index('date');
            
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
