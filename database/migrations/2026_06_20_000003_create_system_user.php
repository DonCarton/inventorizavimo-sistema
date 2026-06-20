<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::table('users')->where('email', User::SYSTEM_EMAIL)->exists()) {
            return;
        }

        $driver = DB::connection()->getDriverName();

        $this->toggleForeignKeyChecks($driver, false);

        $systemUserId = DB::table('users')->insertGetId([
            'name' => 'System',
            'first_name' => 'System',
            'last_name' => 'System',
            'email' => User::SYSTEM_EMAIL,
            'locale' => 'en',
            'is_disabled' => true,
            'email_verified_at' => now(),
            'password' => Hash::make(Str::random(40)),
            'created_by' => 0,
            'updated_by' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->where('id', $systemUserId)->update([
            'created_by' => $systemUserId,
            'updated_by' => $systemUserId,
        ]);

        $this->toggleForeignKeyChecks($driver, true);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('users')->where('email', User::SYSTEM_EMAIL)->delete();
    }

    /**
     * The system user's created_by/updated_by self-reference doesn't exist yet at insert time,
     * so foreign key checks need to be relaxed for the single bootstrap insert.
     */
    private function toggleForeignKeyChecks(string $driver, bool $enabled): void
    {
        match ($driver) {
            'sqlite' => DB::statement('PRAGMA foreign_keys = ' . ($enabled ? 'ON' : 'OFF')),
            'mysql' => DB::statement('SET FOREIGN_KEY_CHECKS=' . ($enabled ? 1 : 0)),
            default => null,
        };
    }
};
