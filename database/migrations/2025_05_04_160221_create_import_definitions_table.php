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
        Schema::create('import_definitions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('model_class'); // e.g., App\Models\InventoryItem
            $table->string('file_path')->nullable(); //Path to file which is linked to import definition
            $table->json('field_mappings'); // {"Product Name": "name", "Code": "sku"}
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_definitions');
    }
};
