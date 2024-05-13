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

        User::factory()->create([
            'name' => 'Damn Admin',
            'first_name' => 'Damn',
            'last_name' => 'Admin',
            'email' => 'damn.admin@tutanota.com',
            'password' => bcrypt('domcyg458'),
            'email_verified_at' => time()
        ]);

//        ItemType::factory(5);
//
//        InventoryItem::factory()
//            ->count(30)
//            ->create();
    }
}
