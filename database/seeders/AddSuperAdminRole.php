<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AddSuperAdminRole extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = [
            'id' => 3,
            'name' => 'super-admin',
            'guard_name' => 'web',
        ];
        Role::firstOrCreate($superAdmin);
    }
}
