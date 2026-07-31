<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('amount_logs', function (Blueprint $table) {
            $table->string('term')->nullable()->after('comment');
        });
    }

    public function down(): void
    {
        Schema::table('amount_logs', function (Blueprint $table) {
            $table->dropColumn('term');
        });
    }
};
