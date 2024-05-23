<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $adminRole = [
            'id' => 1,
            'name' => 'admin',
            'guard_name' => 'web',
        ];
        $userRole = [
            'id' => 2,
            'name' => 'user',
            'guard_name' => 'web',
        ];

        Role::create($adminRole);
        Role::create($userRole);

        $adminUser = User::factory()->create([
            'name' => 'Vardenis Administratorius',
            'first_name' => 'Vardenis',
            'last_name' => 'Administratorius',
            'email' => 'vardenis.administratorius@steamlt.lt',
            'password' => bcrypt('domcyg458'),
            'email_verified_at' => time(),
            'locale' => 'lt',
            'created_by' => 1,
            'updated_by' => 1
        ]);

        $adminUser->assignRole('admin');

        $regularUser = User::factory()->create([
            'name' => 'Vardenis Laborantas',
            'first_name' => 'Vardenis',
            'last_name' => 'Laborantas',
            'email' => 'vardenis.laborantas@steamlt.lt',
            'password' => bcrypt(Str::random(10)),
            'email_verified_at' => time(),
            'locale' => 'lt',
            'created_by' => 1,
            'updated_by' => 1
        ]);

        $regularUser->assignRole('user');

        ItemType::factory()->create([
            'name' => 'Atsargos (kitos sunaudojamos atsargos)',
            'change_acc_amount' => 1,
            'created_by' => 1,
            'updated_by' => 1
        ]);

        ItemType::factory()->create([
            'name' => 'Ilgalaikis (kompiuterinė t..)',
            'change_acc_amount' => 0,
            'created_by' => 1,
            'updated_by' => 1
        ]);

        ItemType::factory()->create([
            'name' => 'Ilgalaikis (laboratorinė technika)',
            'change_acc_amount' => 0,
            'created_by' => 1,
            'updated_by' => 1
        ]);

        ItemType::factory()->create([
            'name' => 'Trumpalaikis (susidėvinčios priemonės)',
            'change_acc_amount' => 0,
            'created_by' => 1,
            'updated_by' => 1
        ]);

        ItemType::factory()->create([
            'name' => 'Atsargos (Reagentai)',
            'change_acc_amount' => 1,
            'created_by' => 1,
            'updated_by' => 1
        ]);
    }
}
