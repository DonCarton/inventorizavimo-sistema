<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

/**
 * Creates the "test" role. The critical_notification setting that used to be created
 * here now lives with all other settings in SystemConfigurationSeeder.
 */
class NotifSeeder extends Seeder
{
    public function run(): void
    {
        Role::firstOrCreate([
            'id' => 4,
            'name' => 'test',
            'guard_name' => 'web',
        ]);
    }
}
