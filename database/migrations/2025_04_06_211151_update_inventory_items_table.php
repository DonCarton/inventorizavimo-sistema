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
            $table->string('cupboard',1)->nullable()->after('laboratory')->change();
            $table->integer('shelf')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropColumn('cupboard');
            $table->foreignId('cupboard')->nullable()->constrained('cupboards')->onDelete('cascade');
            $table->foreignId('shelf')->nullable()->constrained('shelves')->onDelete('cascade');
        });
    }
};
