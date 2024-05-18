<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();


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
            'name' => 'Damn Admin',
            'first_name' => 'Damn',
            'last_name' => 'Admin',
            'email' => 'damn.admin@tutanota.com',
            'password' => bcrypt('domcyg458'),
            'email_verified_at' => time(),
            'locale' => 'lt',
            'created_by' => 1,
            'updated_by' => 1
        ]);

        $adminUser->assignRole('admin');

        ItemType::factory()->create([
            'name' => 'Atsargos (kitos)',
            'change_acc_amount' => 0,
            'created_by' => 1,
            'updated_by' => 1
        ]);

        ItemType::factory()->create([
            'name' => 'Ilgalaikis (kompiuterine tech)',
            'change_acc_amount' => 0,
            'created_by' => 1,
            'updated_by' => 1
        ]);

        ItemType::factory()->create([
            'name' => 'Ilgalaikis (laboratorinis)',
            'change_acc_amount' => 0,
            'created_by' => 1,
            'updated_by' => 1
        ]);

        ItemType::factory()->create([
            'name' => 'Trumpalaikis',
            'change_acc_amount' => 0,
            'created_by' => 1,
            'updated_by' => 1
        ]);

        ItemType::factory()->create([
            'name' => 'Atsargos (reagentai)',
            'change_acc_amount' => 0,
            'created_by' => 1,
            'updated_by' => 1
        ]);

//        ItemType::factory(5);
//
//        InventoryItem::factory()
//            ->count(30)
//            ->create();
    }
}
