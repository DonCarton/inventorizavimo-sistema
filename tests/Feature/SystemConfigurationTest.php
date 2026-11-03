<?php

namespace Tests\Feature;

use App\Models\SystemConfiguration;
use App\Models\User;
use Database\Seeders\SystemConfigurationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class SystemConfigurationTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['id' => 1, 'name' => 'admin', 'guard_name' => 'web']);
        Role::create(['id' => 2, 'name' => 'user', 'guard_name' => 'web']);
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->seed(SystemConfigurationSeeder::class);
    }

    private function setting(string $key): SystemConfiguration
    {
        return SystemConfiguration::with('value')->where('key', $key)->firstOrFail();
    }

    public function test_page_lists_settings_by_category(): void
    {
        $this->actingAs($this->admin)->get(route('systemConfigurations.index'))
            ->assertInertia(fn(AssertableInertia $page) => $page
                ->component('Admin/Index')
                ->has('myConfigurations.general', 4)
                ->missing('systemConfiguration'));
    }

    public function test_seeder_creates_every_setting_once_and_keeps_changed_values(): void
    {
        $this->assertEqualsCanonicalizing(
            ['cupboard_range', 'shelf_range', 'loan_term_limits_enabled', 'critical_notification'],
            SystemConfiguration::pluck('key')->all()
        );

        $this->setting('critical_notification')->value->update(['value' => '1']);
        $this->seed(SystemConfigurationSeeder::class);

        $this->assertSame(4, SystemConfiguration::count());
        $this->assertSame(4, \App\Models\ConfigurationValue::count());
        $this->assertSame('1', $this->setting('critical_notification')->value->value);
    }

    public function test_switch_and_range_values_are_saved(): void
    {
        $this->actingAs($this->admin)
            ->patch(route('systemConfigurations.update', $this->setting('loan_term_limits_enabled')), ['value' => '1'])
            ->assertSessionHasNoErrors();
        $this->actingAs($this->admin)
            ->patch(route('systemConfigurations.update', $this->setting('cupboard_range')), ['value' => '1-25'])
            ->assertSessionHasNoErrors();

        $this->assertSame('1', $this->setting('loan_term_limits_enabled')->value->value);
        $this->assertSame('1-25', $this->setting('cupboard_range')->value->value);
    }

    public function test_invalid_range_gives_one_specific_message(): void
    {
        $this->actingAs($this->admin)
            ->patch(route('systemConfigurations.update', $this->setting('cupboard_range')), ['value' => '1-0']);
        $response = $this->actingAs($this->admin)
            ->patch(route('systemConfigurations.update', $this->setting('shelf_range')), ['value' => 'B-Z']);

        $errors = session('errors')->get('value');
        $this->assertCount(1, $errors);
        $this->assertSame(__('validation.custom.value.range_alphabetical'), $errors[0]);
        $this->assertSame('A-Z', $this->setting('shelf_range')->value->value);
    }

    public function test_regular_users_cannot_open_or_change_settings(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $this->actingAs($user)->get(route('systemConfigurations.index'))->assertForbidden();
        $this->actingAs($user)
            ->patch(route('systemConfigurations.update', $this->setting('cupboard_range')), ['value' => '1-5'])
            ->assertForbidden();
        $this->assertSame('1-20', $this->setting('cupboard_range')->value->value);
    }
}
