<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
           $table->dropForeign(['cupboard']);
           $table->dropForeign(['shelf']);

           $table->foreign('cupboard')->references('id')->on('inventory_items');
           $table->foreign('shelf')->references('id')->on('inventory_items');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropForeign(['cupboard']);
            $table->dropForeign(['shelf']);

            $table->foreign('cupboard')->references('id')->on('cupboards');
            $table->foreign('shelf')->references('id')->on('shelves');
        });
    }
};
