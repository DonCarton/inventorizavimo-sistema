<?php

namespace Tests\Feature;

use App\Imports\ImportRowProcessor;
use App\Models\Facility;
use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Laboratory;
use App\Models\MeasurementUnit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class MeasurementUnitTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $superAdmin;
    private User $regularUser;
    private Laboratory $lab;
    private ItemType $type;

    protected function setUp(): void
    {
        parent::setUp();

        // Policies check roles by id: admin = 1, user = 2, super-admin = 3.
        Role::create(['id' => 1, 'name' => 'admin', 'guard_name' => 'web']);
        Role::create(['id' => 2, 'name' => 'user', 'guard_name' => 'web']);
        Role::create(['id' => 3, 'name' => 'super-admin', 'guard_name' => 'web']);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
        $this->superAdmin = User::factory()->create();
        $this->superAdmin->assignRole('super-admin');
        $this->regularUser = User::factory()->create();
        $this->regularUser->assignRole('user');

        $this->lab = Laboratory::factory()->create(['name' => 'Šviesos laboratorija', 'created_by' => $this->admin->id, 'updated_by' => $this->admin->id]);
        $this->type = ItemType::factory()->create(['change_acc_amount' => true, 'created_by' => $this->admin->id, 'updated_by' => $this->admin->id]);
    }

    private function unit(string $code): MeasurementUnit
    {
        return MeasurementUnit::where('code', $code)->firstOrFail();
    }

    private function item(string $code, array $attributes = []): InventoryItem
    {
        return InventoryItem::create(array_merge([
            'local_name' => $code,
            'inventory_type' => $this->type->id,
            'name' => 'Acetone',
            'name_eng' => 'Acetone',
            'total_amount' => 1,
            'laboratory' => $this->lab->id,
            'created_by' => $this->admin->id,
            'updated_by' => $this->admin->id,
        ], $attributes));
    }

    // --- Existing data -------------------------------------------------------

    public function test_migration_seeds_the_three_original_units(): void
    {
        $this->assertSame(['K', 'L', 'P'], MeasurementUnit::orderBy('code')->pluck('code')->all());
    }

    public function test_items_are_linked_to_the_unit_matching_their_code_suffix(): void
    {
        InventoryItem::withoutEvents(function () {
            $this->item('ŠVIE001-K');
            $this->item('ŠVIE002-L');
            $this->item('ABC001');
        });
        InventoryItem::query()->update(['measurement_unit_id' => null]);

        $unlinked = MeasurementUnit::linkItemsBySuffix();

        $this->assertSame(1, $unlinked);
        $this->assertSame($this->unit('K')->id, InventoryItem::where('local_name', 'ŠVIE001-K')->value('measurement_unit_id'));
        $this->assertSame($this->unit('L')->id, InventoryItem::where('local_name', 'ŠVIE002-L')->value('measurement_unit_id'));
        $this->assertNull(InventoryItem::where('local_name', 'ABC001')->value('measurement_unit_id'));
    }

    // --- Units admin ---------------------------------------------------------

    public function test_admin_creates_a_unit_and_the_code_is_normalized(): void
    {
        $this->actingAs($this->admin)
            ->post(route('measurementUnits.store'), ['code' => ' v ', 'name' => 'Vienetai'])
            ->assertRedirect(route('measurementUnits.index'))
            ->assertSessionHasNoErrors();

        $this->assertTrue(MeasurementUnit::where('code', 'V')->where('is_active', true)->exists());
    }

    public function test_duplicate_or_invalid_unit_codes_are_rejected(): void
    {
        $this->actingAs($this->admin)->post(route('measurementUnits.store'), ['code' => 'k', 'name' => 'Dup'])
            ->assertSessionHasErrors('code');
        $this->actingAs($this->admin)->post(route('measurementUnits.store'), ['code' => 'ABCD', 'name' => 'Too long'])
            ->assertSessionHasErrors('code');
        $this->actingAs($this->admin)->post(route('measurementUnits.store'), ['code' => 'K1', 'name' => 'Digit'])
            ->assertSessionHasErrors('code');
    }

    public function test_regular_users_cannot_manage_units(): void
    {
        $this->actingAs($this->regularUser)->get(route('measurementUnits.index'))->assertForbidden();
        $this->actingAs($this->regularUser)->post(route('measurementUnits.store'), ['code' => 'V', 'name' => 'Vienetai'])->assertForbidden();
    }

    public function test_a_unit_in_use_cannot_be_deleted(): void
    {
        $this->item('ŠVIE001-K');

        $this->actingAs($this->superAdmin)->delete(route('measurementUnits.destroy', $this->unit('K')))
            ->assertSessionHas('warning');
        $this->assertTrue(MeasurementUnit::where('code', 'K')->exists());

        $unused = MeasurementUnit::create(['code' => 'V', 'name' => 'Vienetai']);
        $this->actingAs($this->superAdmin)->delete(route('measurementUnits.destroy', $unused))
            ->assertSessionHas('success');
        $this->assertFalse(MeasurementUnit::where('code', 'V')->exists());
    }

    public function test_renaming_a_unit_code_keeps_existing_item_codes(): void
    {
        $item = $this->item('ŠVIE102-P');

        $this->actingAs($this->admin)
            ->put(route('measurementUnits.update', $this->unit('P')), ['code' => 'PK', 'name' => 'Pakuotės', 'is_active' => true])
            ->assertSessionHasNoErrors();

        $item->refresh();
        $this->assertSame('ŠVIE102-P', $item->local_name);
        $this->assertSame('PK', $item->measurementUnit->code);
    }

    // --- Item create / edit --------------------------------------------------

    private function storePayload(array $overrides = []): array
    {
        $facility = Facility::create(['name' => 'Patalpa', 'created_by' => $this->admin->id, 'updated_by' => $this->admin->id]);

        return array_merge([
            'local_name' => 'ŠVIE001-X',
            'inventory_type' => $this->type->id,
            'name' => 'Acetonas',
            'name_eng' => 'Acetone',
            'total_amount' => 5,
            'critical_amount' => 1,
            'multiple_locations' => false,
            'laboratory' => $this->lab->id,
            'facilities' => [$facility->id],
            'asset_number' => null,
        ], $overrides);
    }

    public function test_new_item_code_gets_the_chosen_unit_suffix(): void
    {
        $unit = MeasurementUnit::create(['code' => 'V', 'name' => 'Vienetai']);

        // The browser sends a stale suffix; the server uses the chosen unit.
        $this->actingAs($this->admin)
            ->post(route('inventoryItems.store'), $this->storePayload(['measurement_unit_id' => $unit->id]))
            ->assertSessionHasNoErrors();

        $item = InventoryItem::sole();
        $this->assertSame('ŠVIE001-V', $item->local_name);
        $this->assertSame($unit->id, $item->measurement_unit_id);
    }

    public function test_inactive_unit_cannot_be_chosen_for_a_new_item(): void
    {
        $unit = MeasurementUnit::create(['code' => 'V', 'name' => 'Vienetai', 'is_active' => false]);

        $this->actingAs($this->admin)
            ->post(route('inventoryItems.store'), $this->storePayload(['measurement_unit_id' => $unit->id]))
            ->assertSessionHasErrors('measurement_unit_id');
    }

    private function updatePayload(InventoryItem $item, array $overrides = []): array
    {
        return array_merge([
            'local_name' => $item->local_name,
            'measurement_unit_id' => $item->measurement_unit_id,
            'name' => $item->name,
            'name_eng' => $item->name_eng,
            'inventory_type' => $item->inventory_type,
            'laboratory' => $item->laboratory,
            'facilities' => [],
            'total_amount' => $item->total_amount,
        ], $overrides);
    }

    public function test_changing_the_unit_rewrites_the_code_suffix(): void
    {
        $item = $this->item('ŠVIE102-P');

        $this->actingAs($this->admin)
            ->put(route('inventoryItems.update', $item), $this->updatePayload($item, ['measurement_unit_id' => $this->unit('K')->id]))
            ->assertSessionHasNoErrors();

        $item->refresh();
        $this->assertSame('ŠVIE102-K', $item->local_name);
        $this->assertSame($this->unit('K')->id, $item->measurement_unit_id);
    }

    public function test_changing_the_unit_to_an_existing_code_is_rejected(): void
    {
        $item = $this->item('ŠVIE102-P');
        $this->item('ŠVIE102-K');

        $this->actingAs($this->admin)
            ->put(route('inventoryItems.update', $item), $this->updatePayload($item, ['measurement_unit_id' => $this->unit('K')->id]))
            ->assertSessionHasErrors('local_name');

        $this->assertSame('ŠVIE102-P', $item->refresh()->local_name);
    }

    public function test_regular_users_cannot_change_the_unit_or_code(): void
    {
        $item = $this->item('ŠVIE102-P');

        $this->actingAs($this->regularUser)->put(route('inventoryItems.update', $item), $this->updatePayload($item, [
            'measurement_unit_id' => $this->unit('K')->id,
            'local_name' => 'ŠVIE999-K',
        ]));

        $item->refresh();
        $this->assertSame('ŠVIE102-P', $item->local_name);
        $this->assertSame($this->unit('P')->id, $item->measurement_unit_id);
    }

    // --- Import --------------------------------------------------------------

    private function importRows(array $codes): array
    {
        return (new ImportRowProcessor(
            modelClass: InventoryItem::class,
            fieldMappings: ['kodas' => 'local_name'],
            foreignKeyLookups: null,
            locale: 'en',
            createdBy: $this->admin->id,
            updatedBy: $this->admin->id,
        ))->process(collect($codes)->map(fn($code) => ['kodas' => $code]));
    }

    public function test_imported_items_are_linked_to_their_unit(): void
    {
        $this->assertSame([], $this->importRows(['ABC001-K', 'ABC1000-L']));

        $this->assertSame($this->unit('K')->id, InventoryItem::where('local_name', 'ABC001-K')->value('measurement_unit_id'));
        $this->assertSame($this->unit('L')->id, InventoryItem::where('local_name', 'ABC1000-L')->value('measurement_unit_id'));
    }

    public function test_import_rejects_an_unknown_unit_for_new_items(): void
    {
        $errors = $this->importRows(['ABC002-Z']);

        $this->assertCount(1, $errors);
        $this->assertStringContainsString('K, L, P', $errors[0]['message']);
        $this->assertSame(0, InventoryItem::count());
    }

    public function test_reimporting_old_codes_works_after_a_unit_was_renamed(): void
    {
        $item = $this->item('ŠVIE102-P');
        $this->unit('P')->update(['code' => 'PK']);

        $this->assertSame([], $this->importRows(['ŠVIE102-P']));
        $this->assertSame($this->unit('PK')->id, $item->refresh()->measurement_unit_id);
    }
}
