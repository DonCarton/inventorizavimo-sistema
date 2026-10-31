<?php

use App\Models\MeasurementUnit;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('measurement_units', function (Blueprint $table) {
            $table->id();
            $table->string('code', 3)->unique();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
        });

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->foreignId('measurement_unit_id')->nullable()->after('local_name')
                ->constrained('measurement_units')->restrictOnDelete();
        });

        // The three units that were hard-coded until now.
        $now = now();
        DB::table('measurement_units')->insert([
            ['code' => 'K', 'name' => 'Kilogramai', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'L', 'name' => 'Litrai', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'P', 'name' => 'Pakuotės', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
        ]);

        $unlinked = MeasurementUnit::linkItemsBySuffix();
        if ($unlinked > 0) {
            Log::warning("Measurement units: {$unlinked} inventory item(s) have no recognisable unit suffix in their code and were left without a unit.");
        }
    }

    public function down(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('measurement_unit_id');
        });
        Schema::dropIfExists('measurement_units');
    }
};
