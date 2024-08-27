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
        Schema::table('system_configurations', function (Blueprint $table) {
            $table->boolean('boolean_value')->nullable()->change();
            $table->enum('category', ['general', 'email', 'users'])->default('general')->after('integer_value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('system_configurations', function (Blueprint $table) {
            $table->boolean('boolean_value')->default(false)->nullable(false)->change();
            $table->dropColumn('category');
        });
    }
};
