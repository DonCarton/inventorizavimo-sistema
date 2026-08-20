<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('item_types', function (Blueprint $table) {
            $table->unsignedInteger('min_loan_term_days')->nullable()->after('change_acc_amount');
            $table->unsignedInteger('max_loan_term_days')->nullable()->after('min_loan_term_days');
        });

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->unsignedInteger('min_loan_term_days')->nullable()->after('comments');
            $table->unsignedInteger('max_loan_term_days')->nullable()->after('min_loan_term_days');
        });
    }

    public function down(): void
    {
        Schema::table('item_types', function (Blueprint $table) {
            $table->dropColumn(['min_loan_term_days', 'max_loan_term_days']);
        });

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropColumn(['min_loan_term_days', 'max_loan_term_days']);
        });
    }
};
