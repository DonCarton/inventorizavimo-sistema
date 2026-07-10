<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Laboratory;
use App\Models\User;
use App\Observers\UserObserver;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Activitylog\CauserResolver;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $systemUser = User::system();
        $systemUserId = $systemUser->id;
        app(CauserResolver::class)->setCauser($systemUser);

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
            'password' => bcrypt('0ZwCe4jCTqt94h7g'),
            'is_disabled' => false,
            'email_verified_at' => time(),
            'locale' => 'lt',
            'created_by' => $systemUserId,
            'updated_by' => $systemUserId
        ]);

        $adminUser->assignRole('admin');

        $regularUser = User::factory()->create([
            'name' => 'Vardenis Laborantas',
            'first_name' => 'Vardenis',
            'last_name' => 'Laborantas',
            'email' => 'vardenis.laborantas@steamlt.lt',
            'password' => bcrypt('3HWkKwg4r'),
            'is_disabled' => false,
            'email_verified_at' => time(),
            'locale' => 'lt',
            'created_by' => $systemUserId,
            'updated_by' => $systemUserId
        ]);

        $regularUser->assignRole('user');

        $laboratory = Laboratory::factory()->create([
            'name' => 'Bazinė',
            'created_by' => $adminUser->id,
            'updated_by' => $adminUser->id
        ]);

        UserObserver::syncLaboratories($adminUser, [$laboratory->id]);
        UserObserver::syncLaboratories($regularUser, [$laboratory->id]);

        ItemType::factory()->create([
            'name' => 'Atsargos (kitos sunaudojamos atsargos)',
            'change_acc_amount' => 1,
            'created_by' => $systemUserId,
            'updated_by' => $systemUserId
        ]);

        ItemType::factory()->create([
            'name' => 'Ilgalaikis (kompiuterinė t..)',
            'change_acc_amount' => 0,
            'created_by' => $systemUserId,
            'updated_by' => $systemUserId
        ]);

        ItemType::factory()->create([
            'name' => 'Ilgalaikis (laboratorinė technika)',
            'change_acc_amount' => 0,
            'created_by' => $systemUserId,
            'updated_by' => $systemUserId
        ]);

        ItemType::factory()->create([
            'name' => 'Trumpalaikis (susidėvinčios priemonės)',
            'change_acc_amount' => 0,
            'created_by' => $systemUserId,
            'updated_by' => $systemUserId
        ]);

        ItemType::factory()->create([
            'name' => 'Atsargos (Reagentai)',
            'change_acc_amount' => 1,
            'created_by' => $systemUserId,
            'updated_by' => $systemUserId
        ]);
    }
}
