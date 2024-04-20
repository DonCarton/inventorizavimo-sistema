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
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('local_name');
            $table->foreignId('type_by_duration')->nullable()->constrained('users');
            $table->foreignId('type_by_use')->nullable()->constrained('users');
            //$table->unsignedBigInteger('type_by_duration')->nullable();
            //$table->unsignedBigInteger('type_by_use')->nullable();
            $table->string('name');
            $table->string('name_eng')->nullable();
            $table->string('formula')->nullable();
            $table->string('cas_nr')->nullable();
            $table->string('user_guide')->nullable();
            $table->string('provider')->nullable();
            $table->string('product_code')->nullable();
            $table->foreignId('barcode')->references('id')->on('barcodes');
            $table->timestamps();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');

            //$table->unsignedBigInteger('created_by');
            //$table->unsignedBigInteger('updated_by');


            //$table->foreign('type_by_duration')->references('id')->on('item_types');
            //$table->foreign('type_by_use')->references('id')->on('item_types');
            //$table->foreign('created_by')->references('id')->on('users');
            //$table->foreign('updated_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};