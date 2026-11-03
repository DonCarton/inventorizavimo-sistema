<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // How many decimals amounts in this unit may have (P = whole numbers).
        Schema::table('measurement_units', function (Blueprint $table) {
            $table->unsignedTinyInteger('decimal_places')->default(0)->after('name');
        });
        DB::table('measurement_units')->whereIn('code', ['K', 'L'])->update(['decimal_places' => 3]);

        // Loans can now be partial amounts (e.g. 0.5 kg); item amounts are already doubles.
        Schema::table('amount_logs', function (Blueprint $table) {
            $table->double('amount')->change();
        });

        // History of what was used up from consumable items, the basis for average consumption.
        Schema::create('consumption_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->cascadeOnDelete();
            $table->double('amount');
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->timestamps();
            $table->index(['inventory_item_id', 'created_at']);
        });

        // The manual (Excel era) average is replaced by a calculated one.
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropColumn('average_consumption');
        });
    }

    public function down(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->double('average_consumption')->nullable();
        });
        Schema::dropIfExists('consumption_logs');
        Schema::table('amount_logs', function (Blueprint $table) {
            $table->integer('amount')->change();
        });
        Schema::table('measurement_units', function (Blueprint $table) {
            $table->dropColumn('decimal_places');
        });
    }
};
