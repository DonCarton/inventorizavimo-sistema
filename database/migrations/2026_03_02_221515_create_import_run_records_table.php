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
        Schema::create('import_run_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('import_run_id')->constrained()->onDelete('cascade');
            $table->string('recordable_type');
            $table->unsignedBigInteger('recordable_id');
            $table->string('action');
            $table->timestamps();

            $table->index(['recordable_type', 'recordable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_run_records');
    }
};
