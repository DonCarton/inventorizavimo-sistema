<?php

namespace Tests\Feature;

use App\Imports\ImportRowProcessor;
use App\Models\AmountLog;
use App\Models\ConsumptionLog;
use App\Models\Facility;
use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Laboratory;
use App\Models\MeasurementUnit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AmountAndConsumptionTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Laboratory $lab;
    private ItemType $consumable;
    private ItemType $loanable;

    protected function setUp(): void
    {
        parent::setUp();

        // Policies check roles by id: admin = 1, user = 2, super-admin = 3.
        Role::create(['id' => 1, 'name' => 'admin', 'guard_name' => 'web']);
        Role::create(['id' => 2, 'name' => 'user', 'guard_name' => 'web']);
        Role::create(['id' => 3, 'name' => 'super-admin', 'guard_name' => 'web']);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->lab = Laboratory::factory()->create(['name' => 'Chemija', 'created_by' => $this->admin->id, 'updated_by' => $this->admin->id]);
        $this->consumable = ItemType::factory()->create(['change_acc_amount' => true, 'created_by' => $this->admin->id, 'updated_by' => $this->admin->id]);
        $this->loanable = ItemType::factory()->create(['change_acc_amount' => false, 'created_by' => $this->admin->id, 'updated_by' => $this->admin->id]);
    }

    private function unit(string $code): MeasurementUnit
    {
        return MeasurementUnit::where('code', $code)->firstOrFail();
    }

    private function item(string $code, float $total = 10, ?ItemType $type = null): InventoryItem
    {
        return InventoryItem::create([
            'local_name' => $code,
            'inventory_type' => ($type ?? $this->consumable)->id,
            'name' => 'Item',
            'name_eng' => 'Item',
            'total_amount' => $total,
            'critical_amount' => 0,
            'laboratory' => $this->lab->id,
            'created_by' => $this->admin->id,
            'updated_by' => $this->admin->id,
        ]);
    }

    private function consumption(InventoryItem $item, float $amount, string $date): void
    {
        DB::table('consumption_logs')->insert([
            'inventory_item_id' => $item->id,
            'amount' => $amount,
            'created_at' => Carbon::parse($date),
            'updated_at' => Carbon::parse($date),
        ]);
    }

    // --- Part A: amounts follow the unit ----------------------------------------

    public function test_migration_sets_decimal_places_and_drops_manual_average(): void
    {
        $this->assertSame(3, $this->unit('K')->decimal_places);
        $this->assertSame(3, $this->unit('L')->decimal_places);
        $this->assertSame(0, $this->unit('P')->decimal_places);
        $this->assertFalse(Schema::hasColumn('inventory_items', 'average_consumption'));
    }

    public function test_new_item_amounts_follow_the_unit(): void
    {
        $facility = Facility::create(['name' => 'Patalpa', 'created_by' => $this->admin->id, 'updated_by' => $this->admin->id]);
        $payload = fn(string $code, $unit, $total) => [
            'local_name' => $code,
            'measurement_unit_id' => $unit->id,
            'inventory_type' => $this->consumable->id,
            'name' => 'Acetonas',
            'name_eng' => 'Acetone',
            'total_amount' => $total,
            'critical_amount' => 1,
            'multiple_locations' => false,
            'laboratory' => $this->lab->id,
            'facilities' => [$facility->id],
            'asset_number' => null,
        ];

        $this->actingAs($this->admin)->post(route('inventoryItems.store'), $payload('CHE001-P', $this->unit('P'), '3.5'))
            ->assertSessionHasErrors('total_amount');
        $this->actingAs($this->admin)->post(route('inventoryItems.store'), $payload('CHE001-P', $this->unit('P'), '3'))
            ->assertSessionHasNoErrors();

        $this->actingAs($this->admin)->post(route('inventoryItems.store'), $payload('CHE002-K', $this->unit('K'), '0.2505'))
            ->assertSessionHasErrors('total_amount');
        $this->actingAs($this->admin)->post(route('inventoryItems.store'), $payload('CHE002-K', $this->unit('K'), '0.250'))
            ->assertSessionHasNoErrors();
    }

    public function test_adding_and_removing_follow_the_unit(): void
    {
        $packages = $this->item('CHE001-P', 10);
        $kilos = $this->item('CHE002-K', 10);

        $this->actingAs($this->admin)->patch(route('inventoryItems.updateAmount', $packages), ['amount_removed' => '0.5'])
            ->assertSessionHasErrors('amount_removed');
        $this->actingAs($this->admin)->patch(route('inventoryItems.updateAmount', $packages), ['amount_added' => '0.5'])
            ->assertSessionHasErrors('amount_added');
        $this->assertSame(10.0, (float) $packages->refresh()->total_amount);

        $this->actingAs($this->admin)->patch(route('inventoryItems.updateAmount', $kilos), ['amount_removed' => '0.25'])
            ->assertSessionHasNoErrors();
        $this->assertSame(9.75, (float) $kilos->refresh()->total_amount);
    }

    public function test_removing_more_than_available_is_rejected(): void
    {
        $item = $this->item('CHE001-K', 1);

        $this->actingAs($this->admin)->patch(route('inventoryItems.updateAmount', $item), ['amount_removed' => '2'])
            ->assertSessionHasErrors('amount_removed');
        $this->assertSame(0, ConsumptionLog::count());
    }

    public function test_repeated_decimal_removals_do_not_leave_float_leftovers(): void
    {
        $item = $this->item('CHE001-K', 1.0);

        $this->actingAs($this->admin)->patch(route('inventoryItems.updateAmount', $item), ['amount_removed' => '0.1']);
        $this->actingAs($this->admin)->patch(route('inventoryItems.updateAmount', $item), ['amount_removed' => '0.2']);

        $this->assertSame(0.7, (float) $item->refresh()->total_amount);
    }

    private function loan(InventoryItem $item, string $amount)
    {
        return $this->actingAs($this->admin)->patch(route('inventoryItems.takeOutAmountLog', $item), [
            'laboratory_id' => $this->lab->id,
            'action' => 'REMOVE',
            'amount' => $amount,
            'total_available' => 100,
            'comment' => 'Pamokai',
            'term' => '2 savaitės',
        ]);
    }

    public function test_loans_follow_the_unit_and_allow_decimals(): void
    {
        $packages = $this->item('FIZ001-P', 10, $this->loanable);
        $kilos = $this->item('FIZ002-K', 10, $this->loanable);

        $this->loan($packages, '0.5')->assertSessionHasErrors('amount');
        $this->assertSame(0, AmountLog::count());

        $this->loan($kilos, '0.5')->assertSessionHasNoErrors();
        $this->assertSame(0.5, (float) AmountLog::sole()->amount);
    }

    public function test_import_amounts_follow_the_unit_of_the_code(): void
    {
        $errors = (new ImportRowProcessor(
            modelClass: InventoryItem::class,
            fieldMappings: ['kodas' => 'local_name', 'kiekis' => 'total_amount'],
            foreignKeyLookups: null,
            locale: 'en',
            createdBy: $this->admin->id,
            updatedBy: $this->admin->id,
        ))->process(collect([
            ['kodas' => 'ABC001-P', 'kiekis' => 2.5],
            ['kodas' => 'ABC002-K', 'kiekis' => 2.5],
        ]));

        $this->assertCount(1, $errors);
        $this->assertSame(2, $errors[0]['row']);
        $this->assertSame('total_amount', $errors[0]['attribute']);
        $this->assertTrue(InventoryItem::where('local_name', 'ABC002-K')->exists());
    }

    // --- Part B: consumption history and average -----------------------------

    public function test_only_removals_from_consumables_are_recorded_as_consumption(): void
    {
        $consumable = $this->item('CHE001-K', 10);
        $loanable = $this->item('FIZ001-K', 10, $this->loanable);

        $this->actingAs($this->admin)->patch(route('inventoryItems.updateAmount', $consumable), ['amount_removed' => '1.5']);
        $this->actingAs($this->admin)->patch(route('inventoryItems.updateAmount', $consumable), ['amount_added' => '4']);
        $this->loan($loanable, '1');

        $this->assertSame(1, ConsumptionLog::count());
        $log = ConsumptionLog::sole();
        $this->assertSame($consumable->id, $log->inventory_item_id);
        $this->assertSame(1.5, $log->amount);
    }

    public function test_average_is_divided_by_the_months_since_first_use(): void
    {
        $this->travelTo(Carbon::parse('2026-10-15 12:00'));
        $item = $this->item('CHE001-K');

        $this->consumption($item, 3, '2026-08-10');
        $this->consumption($item, 2, '2026-09-20');
        $this->consumption($item, 1, '2026-10-01');

        // First use in August -> Aug, Sep, Oct = 3 months.
        $this->assertSame(2.0, $item->averageMonthlyConsumption());
    }

    public function test_item_first_used_this_month_is_divided_by_one(): void
    {
        $this->travelTo(Carbon::parse('2026-10-15 12:00'));
        $item = $this->item('CHE001-K');
        $this->consumption($item, 1.25, '2026-10-02');

        $this->assertSame(1.25, $item->averageMonthlyConsumption());
    }

    public function test_usage_older_than_twelve_months_is_ignored(): void
    {
        $this->travelTo(Carbon::parse('2026-10-15 12:00'));
        $item = $this->item('CHE001-K');
        $this->consumption($item, 100, '2025-01-10');
        $this->consumption($item, 6, '2026-10-02');

        // Long history -> full 12 months; only the recent 6 is inside the window.
        $this->assertSame(0.5, $item->averageMonthlyConsumption());
    }

    public function test_no_usage_means_no_average(): void
    {
        $this->assertNull($this->item('CHE001-K')->averageMonthlyConsumption());
    }

    public function test_average_is_rounded_to_the_unit(): void
    {
        $this->travelTo(Carbon::parse('2026-10-15 12:00'));
        $item = $this->item('CHE001-P');
        $this->consumption($item, 1, '2026-08-10');
        $this->consumption($item, 1, '2026-10-02');

        // 2 packages over 3 months = 0.666..., shown as whole packages.
        $this->assertSame(1.0, $item->averageMonthlyConsumption());
    }

    public function test_bulk_average_matches_the_per_item_average(): void
    {
        $this->travelTo(Carbon::parse('2026-10-15 12:00'));
        $first = $this->item('CHE001-K');
        $second = $this->item('CHE002-L');
        $unused = $this->item('CHE003-K');
        $this->consumption($first, 3, '2026-08-10');
        $this->consumption($first, 1.5, '2026-10-02');
        $this->consumption($second, 0.75, '2026-10-05');

        $bulk = InventoryItem::averageMonthlyConsumptionFor(collect([$first, $second, $unused]));

        $this->assertSame($first->averageMonthlyConsumption(), $bulk[$first->id]);
        $this->assertSame($second->averageMonthlyConsumption(), $bulk[$second->id]);
        $this->assertNull($bulk[$unused->id]);
    }

    // --- Part C: data for the usage chart --------------------------------------

    public function test_monthly_consumption_series(): void
    {
        $this->travelTo(Carbon::parse('2026-10-15 12:00'));
        $item = $this->item('CHE001-K');
        $this->consumption($item, 100, '2025-09-30');
        $this->consumption($item, 1, '2026-03-02');
        $this->consumption($item, 0.5, '2026-03-28');
        $this->consumption($item, 2, '2026-10-01');

        $series = $item->monthlyConsumption();

        $this->assertCount(12, $series);
        $this->assertSame('2025-11', $series[0]['month']);
        $this->assertSame('2026-10', $series[11]['month']);
        $amounts = array_column($series, 'amount', 'month');
        $this->assertSame(1.5, $amounts['2026-03']);
        $this->assertSame(2.0, $amounts['2026-10']);
        $this->assertSame(0.0, $amounts['2026-01']);
        $this->assertSame(3.5, array_sum($amounts));
    }

    public function test_item_page_gets_the_chart_data_for_consumables_only(): void
    {
        $consumable = $this->item('CHE001-K');
        $loanable = $this->item('FIZ001-K', 10, $this->loanable);

        $this->actingAs($this->admin)->get(route('inventoryItems.show', $consumable->id))
            ->assertInertia(fn(AssertableInertia $page) => $page
                ->component('Inventory/Show')
                ->has('consumptionByMonth', 12));

        $this->actingAs($this->admin)->get(route('inventoryItems.show', $loanable->id))
            ->assertInertia(fn(AssertableInertia $page) => $page
                ->component('Inventory/Show')
                ->where('consumptionByMonth', null));
    }
}
