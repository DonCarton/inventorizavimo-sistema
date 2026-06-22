<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('users')
            ->whereNotNull('laboratory')
            ->select('id', 'laboratory')
            ->orderBy('id')
            ->each(function ($user) {
                DB::table('laboratory_user')->insert([
                    'user_id' => $user->id,
                    'laboratory_id' => $user->laboratory,
                ]);
            });

        DB::table('users')->update(['laboratory' => null]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('laboratory_user')
            ->orderBy('user_id')
            ->each(function ($pivotRow) {
                DB::table('users')
                    ->where('id', $pivotRow->user_id)
                    ->update(['laboratory' => $pivotRow->laboratory_id]);
            });

        DB::table('laboratory_user')->truncate();
    }
};
