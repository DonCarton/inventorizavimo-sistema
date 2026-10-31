<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

/**
 * The menu shows links based on the shared auth.can.view.* flags, so these flags
 * must match what each role can actually open.
 */
class NavigationPermissionsTest extends TestCase
{
    use RefreshDatabase;

    private const ADMIN_PAGES = [
        'user', 'laboratory', 'facility', 'itemType', 'measurementUnit',
        'importDefinition', 'importRun', 'systemConfiguration',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        // Policies check roles by id: admin = 1, user = 2, super-admin = 3.
        Role::create(['id' => 1, 'name' => 'admin', 'guard_name' => 'web']);
        Role::create(['id' => 2, 'name' => 'user', 'guard_name' => 'web']);
        Role::create(['id' => 3, 'name' => 'super-admin', 'guard_name' => 'web']);
    }

    private function viewFlagsFor(string $role): array
    {
        $user = User::factory()->create();
        $user->assignRole($role);

        $flags = [];
        $this->actingAs($user)->get(route('dashboard'))
            ->assertInertia(function (AssertableInertia $page) use (&$flags) {
                $flags = $page->toArray()['props']['auth']['can']['view'];
            });

        return $flags;
    }

    public function test_regular_users_see_no_admin_pages(): void
    {
        $flags = $this->viewFlagsFor('user');

        foreach (self::ADMIN_PAGES as $page) {
            $this->assertFalse($flags[$page], "user should not see {$page}");
        }
        $this->assertTrue($flags['inventoryItem']);
    }

    public function test_admins_and_super_admins_see_all_admin_pages(): void
    {
        foreach (['admin', 'super-admin'] as $role) {
            $flags = $this->viewFlagsFor($role);
            foreach (self::ADMIN_PAGES as $page) {
                $this->assertTrue($flags[$page], "{$role} should see {$page}");
            }
        }
    }

    public function test_hidden_import_pages_are_also_closed_to_regular_users(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $this->actingAs($user)->get(route('import-definitions.index'))->assertForbidden();
        $this->actingAs($user)->get(route('import-runs.index'))->assertForbidden();
    }
}
