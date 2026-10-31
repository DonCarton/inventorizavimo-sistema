<?php

namespace Tests\Feature\Upgrade;

use App\Enums\InventoryStatusEnum;
use App\Imports\ImportRowProcessor;
use App\Models\AmountLog;
use App\Models\InventoryItem;
use App\Models\MeasurementUnit;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

/**
 * Upgrade rehearsal for the measurement unit / amount / consumption release.
 *
 * Every test starts from the schema production has *before* the release (the two new
 * migrations rolled back), fills it with legacy data the way the old code stored it,
 * runs the deploy migrations, and then checks one scenario on the upgraded data.
 *
 * Runs only on an in-memory SQLite database or a database named "upgrade_rehearsal",
 * because it rebuilds the schema from scratch.
 */
class UnitChangesUpgradeTest extends TestCase
{
    private const NEW_MIGRATIONS = 2;

    private User $admin;
    private User $superAdmin;
    private int $labA;
    private int $labB;
    private int $loanable;
    private int $consumable;
    /** @var array<string, float> Availability per item code, computed before the upgrade. */
    private array $availabilityBefore = [];

    protected function setUp(): void
    {
        parent::setUp();

        $connection = config('database.default');
        $database = config("database.connections.{$connection}.database");
        if (!in_array($database, [':memory:', 'upgrade_rehearsal'], true)) {
            $this->markTestSkipped("Upgrade rehearsal only runs on :memory: or 'upgrade_rehearsal' (got '{$database}').");
        }

        Artisan::call('migrate:fresh', ['--force' => true]);
        Artisan::call('migrate:rollback', ['--step' => self::NEW_MIGRATIONS, '--force' => true]);
        $this->assertTrue(Schema::hasColumn('inventory_items', 'average_consumption'), 'pre-upgrade schema expected');
        $this->assertFalse(Schema::hasTable('measurement_units'), 'pre-upgrade schema expected');

        $this->seedLegacyData();

        Artisan::call('migrate', ['--force' => true]);
    }

    private function seedLegacyData(): void
    {
        Role::create(['id' => 1, 'name' => 'admin', 'guard_name' => 'web']);
        Role::create(['id' => 2, 'name' => 'user', 'guard_name' => 'web']);
        Role::create(['id' => 3, 'name' => 'super-admin', 'guard_name' => 'web']);
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
        $this->superAdmin = User::factory()->create();
        $this->superAdmin->assignRole('super-admin');

        $by = ['created_by' => $this->admin->id, 'updated_by' => $this->admin->id, 'created_at' => now(), 'updated_at' => now()];

        $this->labA = DB::table('laboratories')->insertGetId(['name' => 'Biologija', 'ident_code' => 'BIO'] + $by);
        $this->labB = DB::table('laboratories')->insertGetId(['name' => 'Chemija', 'ident_code' => 'CHE'] + $by);
        $this->loanable = DB::table('item_types')->insertGetId(['name' => 'Ilgalaikis', 'change_acc_amount' => false] + $by);
        $this->consumable = DB::table('item_types')->insertGetId(['name' => 'Reagentai', 'change_acc_amount' => true] + $by);

        // code => [type, total, critical, legacy manual average]
        $items = [
            'BIO001-K'   => [$this->loanable, 10, 1, null],
            'BIO002-P'   => [$this->loanable, 5, 1, null],
            'BIO003-L'   => [$this->consumable, 8, 1, 2.5],
            'OLD-ITEM-1' => [$this->loanable, 4, 0, null],   // code without a unit suffix
            'BIO004-P'   => [$this->consumable, 2.5, 0, 1.0], // legacy fractional packages
            'BIO005-K'   => [$this->loanable, 5, 0, null],
        ];
        foreach ($items as $code => [$type, $total, $critical, $average]) {
            DB::table('inventory_items')->insert([
                'local_name' => $code, 'inventory_type' => $type, 'name' => $code, 'name_eng' => $code,
                'total_amount' => $total, 'critical_amount' => $critical, 'average_consumption' => $average,
                'laboratory' => $this->labA,
            ] + $by);
        }

        // Open loans, stored as whole numbers like the old code did.
        $loans = [
            ['BIO001-K', $this->labA, 'REMOVE', 3],
            ['BIO001-K', $this->labA, 'RETURN', 1],
            ['BIO002-P', $this->labA, 'REMOVE', 2],
            ['OLD-ITEM-1', $this->labB, 'REMOVE', 1],
        ];
        foreach ($loans as [$code, $lab, $action, $amount]) {
            DB::table('amount_logs')->insert([
                'inventory_item_id' => $this->itemId($code), 'laboratory_id' => $lab,
                'action' => $action, 'amount' => $amount, 'comment' => 'Legacy loan', 'term' => '2 savaitės',
            ] + $by);
        }

        foreach (array_keys($items) as $code) {
            $this->availabilityBefore[$code] = $this->availability($code);
        }
    }

    private function itemId(string $code): int
    {
        return (int) DB::table('inventory_items')->where('local_name', $code)->value('id');
    }

    private function item(string $code): InventoryItem
    {
        return InventoryItem::where('local_name', $code)->firstOrFail();
    }

    /** Stock not currently on loan: total - borrowed + returned (as the loan page computes it). */
    private function availability(string $code): float
    {
        $id = $this->itemId($code);
        $total = (float) DB::table('inventory_items')->where('id', $id)->value('total_amount');
        $removed = (float) DB::table('amount_logs')->where('inventory_item_id', $id)->where('action', 'REMOVE')->sum('amount');
        $returned = (float) DB::table('amount_logs')->where('inventory_item_id', $id)->where('action', 'RETURN')->sum('amount');

        return $total - $removed + $returned;
    }

    private function loanAction(string $code, string $action, string $amount, ?int $lab = null)
    {
        return $this->actingAs($this->admin)->patch(route('inventoryItems.takeOutAmountLog', $this->itemId($code)), [
            'laboratory_id' => $lab ?? $this->labA,
            'action' => $action,
            'amount' => $amount,
            'total_available' => $this->availability($code),
            'comment' => 'Rehearsal ' . strtolower($action),
            'term' => $action === 'REMOVE' ? '2 savaitės' : null,
        ]);
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
            'critical_amount' => $item->critical_amount,
        ], $overrides);
    }

    // ------------------------------------------------------------------------

    public function test_01_migration_keeps_existing_loan_amounts(): void
    {
        $this->assertTrue(Schema::hasTable('measurement_units'));
        $this->assertTrue(Schema::hasTable('consumption_logs'));
        $this->assertSame(4, AmountLog::count());
        $this->assertEquals(3, AmountLog::where('inventory_item_id', $this->itemId('BIO001-K'))->where('action', 'REMOVE')->value('amount'));
        $this->assertEquals(1, AmountLog::where('inventory_item_id', $this->itemId('BIO001-K'))->where('action', 'RETURN')->value('amount'));
        $this->assertEquals(2, AmountLog::where('inventory_item_id', $this->itemId('BIO002-P'))->value('amount'));
    }

    public function test_02_items_are_linked_to_units_by_code_suffix(): void
    {
        $this->assertSame('K', $this->item('BIO001-K')->measurementUnit?->code);
        $this->assertSame('P', $this->item('BIO002-P')->measurementUnit?->code);
        $this->assertSame('L', $this->item('BIO003-L')->measurementUnit?->code);
        $this->assertNull($this->item('OLD-ITEM-1')->measurement_unit_id);
        $this->assertSame(1, MeasurementUnit::linkItemsBySuffix(), 'one item without a unit suffix is reported');
    }

    public function test_03_manual_average_is_dropped_and_calculated_average_starts_empty(): void
    {
        $this->assertFalse(Schema::hasColumn('inventory_items', 'average_consumption'));
        $this->assertNull($this->item('BIO003-L')->averageMonthlyConsumption());
    }

    public function test_04_open_legacy_loans_keep_status_and_availability(): void
    {
        foreach ($this->availabilityBefore as $code => $before) {
            $this->assertEquals($before, $this->availability($code), "availability of {$code}");
        }
        $this->assertSame(InventoryStatusEnum::TAKEN, $this->item('BIO001-K')->status);

        $this->actingAs($this->admin)->get(route('inventoryItems.edit', $this->itemId('BIO001-K')))
            ->assertInertia(fn(AssertableInertia $page) => $page->component('User/EditLog')->where('totalInUse', 8));
    }

    public function test_05_returning_a_legacy_loan_in_full_closes_it(): void
    {
        $this->loanAction('BIO001-K', 'RETURN', '2')->assertSessionHasNoErrors();

        $this->assertSame(0, AmountLog::where('inventory_item_id', $this->itemId('BIO001-K'))->count());
        $this->assertNotSame(InventoryStatusEnum::TAKEN, $this->item('BIO001-K')->status);
    }

    public function test_06_returning_more_than_borrowed_is_still_rejected(): void
    {
        $this->loanAction('BIO002-P', 'RETURN', '3')->assertSessionHasErrors('amount');
        $this->assertSame(1, AmountLog::where('inventory_item_id', $this->itemId('BIO002-P'))->count());
    }

    public function test_07_decimal_loan_returned_in_full_closes_it(): void
    {
        $this->loanAction('BIO005-K', 'REMOVE', '0.1')->assertSessionHasNoErrors();
        $this->loanAction('BIO005-K', 'REMOVE', '0.2')->assertSessionHasNoErrors();
        $this->loanAction('BIO005-K', 'RETURN', '0.3')->assertSessionHasNoErrors();

        $this->assertSame(0, AmountLog::where('inventory_item_id', $this->itemId('BIO005-K'))->count(), 'loan entries should be cleaned up');
        $this->assertNotSame(InventoryStatusEnum::TAKEN, $this->item('BIO005-K')->status);
    }

    public function test_08_returning_the_exact_remainder_of_a_decimal_loan_is_accepted(): void
    {
        $this->loanAction('BIO005-K', 'REMOVE', '0.3')->assertSessionHasNoErrors();
        $this->loanAction('BIO005-K', 'RETURN', '0.1')->assertSessionHasNoErrors();
        $this->loanAction('BIO005-K', 'RETURN', '0.2')->assertSessionHasNoErrors();

        $this->assertSame(0, AmountLog::where('inventory_item_id', $this->itemId('BIO005-K'))->count());
    }

    public function test_09_half_a_package_cannot_be_loaned(): void
    {
        $this->loanAction('BIO002-P', 'REMOVE', '0.5')->assertSessionHasErrors('amount');
        $this->assertSame(1, AmountLog::where('inventory_item_id', $this->itemId('BIO002-P'))->count());
    }

    public function test_10_legacy_fractional_package_item_can_still_be_renamed(): void
    {
        $item = $this->item('BIO004-P');

        $this->actingAs($this->admin)
            ->put(route('inventoryItems.update', $item->id), $this->updatePayload($item, ['name' => 'Pervadinta']))
            ->assertSessionHasNoErrors();

        $this->assertSame('Pervadinta', $item->refresh()->name);

        // A *new* fractional amount for packages is still rejected; whole numbers are fine.
        $this->actingAs($this->admin)
            ->put(route('inventoryItems.update', $item->id), $this->updatePayload($item, ['total_amount' => '3.5']))
            ->assertSessionHasErrors('total_amount');
        $this->actingAs($this->admin)
            ->put(route('inventoryItems.update', $item->id), $this->updatePayload($item, ['total_amount' => '3']))
            ->assertSessionHasNoErrors();
        $this->assertEquals(3, $item->refresh()->total_amount);
    }

    public function test_11_removing_from_legacy_fractional_packages_keeps_the_fraction(): void
    {
        $this->actingAs($this->admin)
            ->patch(route('inventoryItems.updateAmount', $this->itemId('BIO004-P')), ['amount_removed' => '1'])
            ->assertSessionHasNoErrors();

        $this->assertEquals(1.5, $this->item('BIO004-P')->total_amount);
    }

    public function test_12_changing_the_unit_of_an_item_with_open_loans_keeps_them(): void
    {
        $item = $this->item('BIO001-K');
        $litres = MeasurementUnit::where('code', 'L')->firstOrFail();

        $this->actingAs($this->admin)
            ->put(route('inventoryItems.update', $item->id), $this->updatePayload($item, ['measurement_unit_id' => $litres->id]))
            ->assertSessionHasNoErrors();

        $this->assertSame('BIO001-L', $item->refresh()->local_name);
        $this->assertSame(2, AmountLog::where('inventory_item_id', $item->id)->count());
        $this->assertEquals(8, $this->availability('BIO001-L'));
    }

    public function test_13_a_unit_used_by_items_cannot_be_deleted(): void
    {
        $kilograms = MeasurementUnit::where('code', 'K')->firstOrFail();

        $this->actingAs($this->superAdmin)->delete(route('measurementUnits.destroy', $kilograms))
            ->assertSessionHas('warning');
        $this->assertTrue(MeasurementUnit::whereKey($kilograms->id)->exists());
    }

    public function test_14_reimporting_a_legacy_fractional_package_row_keeps_working(): void
    {
        $import = fn(float $amount) => (new ImportRowProcessor(
            modelClass: InventoryItem::class,
            fieldMappings: ['kodas' => 'local_name', 'kiekis' => 'total_amount'],
            foreignKeyLookups: null,
            locale: 'en',
            createdBy: $this->admin->id,
            updatedBy: $this->admin->id,
        ))->process(collect([['kodas' => 'BIO004-P', 'kiekis' => $amount]]));

        // The unchanged legacy value is accepted ...
        $this->assertSame([], $import(2.5));
        // ... but a new fractional amount for packages is not.
        $errors = $import(3.5);
        $this->assertCount(1, $errors);
        $this->assertSame('total_amount', $errors[0]['attribute']);
        $this->assertEquals(2.5, $this->item('BIO004-P')->total_amount);
    }

    public function test_15_unit_error_messages_are_translated(): void
    {
        $this->loanAction('BIO002-P', 'REMOVE', '0.5')->assertSessionHasErrors('amount');

        $message = session('errors')->first('amount');
        $this->assertStringNotContainsString('validation.custom', $message);
        $this->assertStringContainsString('Pakuotės', $message);
    }
}
