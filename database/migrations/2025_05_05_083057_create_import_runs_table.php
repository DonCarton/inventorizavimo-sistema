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
        Schema::create('import_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('import_definition_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->string('file_path'); // e.g. 'imports/user_42/2025_05_04_Products.xlsx'
            $table->enum('status', ['pending', 'processing', 'completed', 'failed']);
            $table->integer('rows_total')->nullable();
            $table->integer('rows_failed')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_runs');
    }
};
