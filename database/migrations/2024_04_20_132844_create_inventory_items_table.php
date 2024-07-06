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
            $table->string('local_name')->unique();
            $table->foreignId('inventory_type')->nullable()->constrained('item_types');
            $table->string('name')->nullable();
            $table->string('name_eng')->nullable();
            $table->string('formula')->nullable();
            $table->string('cas_nr')->nullable();
            $table->string('user_guide')->nullable();
            $table->string('provider')->nullable();
            $table->string('product_code')->nullable();
            $table->string('barcode')->nullable();
            $table->longText('url_to_provider')->nullable();
            $table->longText('alt_url_to_provider')->nullable();
            $table->double('total_count')->nullable();
            $table->double('critical_amount')->nullable();
            $table->double('to_order')->nullable();
            $table->double('average_consumption')->nullable();
//            $table->bigInteger('total_count')->nullable();
//            $table->bigInteger('critical_amount')->nullable();
//            $table->bigInteger('to_order')->nullable();
//            $table->bigInteger('average_consumption')->nullable();
            $table->boolean('multiple_locations')->nullable();
            $table->foreignId('laboratory')->nullable()->constrained('laboratories');
            $table->foreignId('cupboard')->nullable()->constrained('cupboards');
            $table->foreignId('shelf')->nullable()->constrained('shelves');
            $table->longText('storage_conditions')->nullable();
            $table->longText('asset_number')->nullable();
            $table->longText('used_for')->nullable();
            $table->longText('comments')->nullable();
            $table->timestamps();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
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
