<?php

namespace Tests\Feature;

use App\Exports\InventoryExports;
use App\Imports\ImportRowProcessor;
use App\Models\Facility;
use App\Models\InventoryItem;
use App\Models\Laboratory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ImportDryRunTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private const MAPPING = [
        'kodas' => 'local_name',
        'pavadinimas' => 'name',
        'laboratorija' => 'laboratory',
        'spinta' => 'cupboard',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        Role::findOrCreate('admin', 'web');
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        Laboratory::factory()->create([
            'name' => 'Chemistry',
            'created_by' => $this->admin->id,
            'updated_by' => $this->admin->id,
        ]);
    }

    private function csv(array $rows): UploadedFile
    {
        $lines = array_merge([['Kodas', 'Pavadinimas', 'Laboratorija', 'Spinta']], $rows);
        $content = implode("\n", array_map(fn($row) => implode(',', $row), $lines)) . "\n";

        return UploadedFile::fake()->createWithContent('items.csv', $content);
    }

    private function dryRun(UploadedFile $file)
    {
        return $this->actingAs($this->admin)->postJson(route('imports.dryRun'), [
            'model_class' => InventoryItem::class,
            'field_mappings' => self::MAPPING,
            'file' => $file,
        ]);
    }

    public function test_valid_file_passes_and_nothing_is_persisted(): void
    {
        $response = $this->dryRun($this->csv([
            ['ABC001-K', 'Acetone', 'Chemistry', ''],
            ['ABC002-K', 'Ethanol', 'Chemistry', ''],
        ]));

        $response->assertOk()->assertJson([
            'passed' => true,
            'total_rows' => 2,
            'error_count' => 0,
        ]);
        $this->assertSame(0, InventoryItem::count());
    }

    public function test_validation_and_lookup_errors_are_reported_per_row(): void
    {
        $response = $this->dryRun($this->csv([
            ['bad-code', 'Acetone', 'Chemistry', ''],
            ['ABC002-K', 'Ethanol', 'Unknown lab', ''],
            ['ABC003-K', 'Water', 'Chemistry', ''],
        ]));

        $response->assertOk()->assertJson(['passed' => false, 'total_rows' => 3]);

        $errors = collect($response->json('errors'));
        $this->assertTrue($errors->contains(fn($e) => $e['row'] === 2 && $e['attribute'] === 'local_name'));
        $this->assertTrue($errors->contains(fn($e) => $e['row'] === 3 && $e['attribute'] === 'laboratory'));
        $this->assertFalse($errors->contains(fn($e) => $e['row'] === 4));
        $this->assertSame(0, InventoryItem::count());
    }

    /**
     * Simulates a row that passes validation but fails while saving
     * (e.g. a database constraint), independent of the current schema.
     */
    private function failSavingItemsNamed(string $name): void
    {
        InventoryItem::saving(function (InventoryItem $item) use ($name) {
            if ($item->name === $name) {
                throw new \RuntimeException('Simulated database failure');
            }
        });
    }

    public function test_database_error_is_reported_and_remaining_rows_are_still_checked(): void
    {
        $this->failSavingItemsNamed('Explodes');

        $response = $this->dryRun($this->csv([
            ['ABC001-K', 'Explodes', 'Chemistry', ''],
            ['bad-code', 'Ethanol', 'Chemistry', ''],
        ]));

        $errors = collect($response->json('errors'));
        $this->assertTrue($errors->contains(fn($e) => $e['row'] === 2 && $e['attribute'] === ''));
        $this->assertTrue($errors->contains(fn($e) => $e['row'] === 3 && $e['attribute'] === 'local_name'));
        $this->assertSame(0, InventoryItem::count());
    }

    public function test_real_processing_skips_a_failing_row_and_saves_the_rest(): void
    {
        $this->failSavingItemsNamed('Explodes');

        $processor = new ImportRowProcessor(
            modelClass: InventoryItem::class,
            fieldMappings: self::MAPPING,
            foreignKeyLookups: null,
            locale: 'en',
            createdBy: $this->admin->id,
            updatedBy: $this->admin->id,
        );

        $errors = $processor->process(collect([
            ['kodas' => 'ABC001-K', 'pavadinimas' => 'Explodes', 'laboratorija' => 'Chemistry', 'spinta' => null],
            ['kodas' => 'ABC002-K', 'pavadinimas' => 'Ethanol', 'laboratorija' => (string) Laboratory::first()->id, 'spinta' => null],
        ]));

        $this->assertCount(1, $errors);
        $this->assertSame(2, $errors[0]['row']);
        $this->assertFalse(InventoryItem::where('local_name', 'ABC001-K')->exists());
        // Numeric laboratory id is accepted, same as the validation rule allows.
        $this->assertSame(Laboratory::first()->id, (int) InventoryItem::where('local_name', 'ABC002-K')->value('laboratory'));
    }

    private function lithuanianFixtures(): array
    {
        $lab = Laboratory::factory()->create([
            'name' => 'Šviesos laboratorija',
            'created_by' => $this->admin->id,
            'updated_by' => $this->admin->id,
        ]);
        $facility = Facility::create([
            'name' => 'Švarioji patalpa',
            'created_by' => $this->admin->id,
            'updated_by' => $this->admin->id,
        ]);
        $lab->facilities()->attach($facility);

        return [$lab, $facility];
    }

    private function lithuanianDryRun(string $content, string $fileName = 'items.csv')
    {
        return $this->actingAs($this->admin)->postJson(route('imports.dryRun'), [
            'model_class' => InventoryItem::class,
            'field_mappings' => ['kodas' => 'local_name', 'laboratorija' => 'laboratory', 'patalpa' => 'facilities'],
            'file' => UploadedFile::fake()->createWithContent($fileName, $content),
        ]);
    }

    public function test_lithuanian_characters_in_codes_and_lookups_pass(): void
    {
        $this->lithuanianFixtures();

        $response = $this->lithuanianDryRun(
            "Kodas,Laboratorija,Patalpa\nŠVIE102-P,Šviesos laboratorija,Švarioji patalpa\nŽČĄ001-L,Šviesos laboratorija,\n"
        );

        $response->assertOk()->assertJson(['passed' => true, 'total_rows' => 2, 'error_count' => 0]);
    }

    public function test_lithuanian_characters_are_saved_and_linked(): void
    {
        [$lab, $facility] = $this->lithuanianFixtures();

        $errors = (new ImportRowProcessor(
            modelClass: InventoryItem::class,
            fieldMappings: ['kodas' => 'local_name', 'laboratorija' => 'laboratory', 'patalpa' => 'facilities'],
            foreignKeyLookups: null,
            locale: 'lt',
            createdBy: $this->admin->id,
            updatedBy: $this->admin->id,
        ))->process(collect([
            ['kodas' => 'ŠVIE102-P', 'laboratorija' => 'Šviesos laboratorija', 'patalpa' => 'Švarioji patalpa'],
        ]));

        $this->assertSame([], $errors);
        $item = InventoryItem::where('local_name', 'ŠVIE102-P')->firstOrFail();
        $this->assertSame($lab->id, (int) $item->laboratory);
        $this->assertTrue($item->facilities()->whereKey($facility->id)->exists());
    }

    public function test_windows_1257_csv_from_lithuanian_excel_is_read_correctly(): void
    {
        $this->lithuanianFixtures();

        // Plain "CSV" saved by Excel on Lithuanian Windows is CP1257, not UTF-8.
        $content = iconv('UTF-8', 'CP1257', "Kodas,Laboratorija,Patalpa\nŠVIE102-P,Šviesos laboratorija,Švarioji patalpa\n");
        $this->assertFalse(mb_check_encoding($content, 'UTF-8'));

        $this->lithuanianDryRun($content)
            ->assertOk()
            ->assertJson(['passed' => true, 'total_rows' => 1, 'error_count' => 0]);

        $headers = $this->actingAs($this->admin)->postJson(route('imports.previewHeaders'), [
            'file' => UploadedFile::fake()->createWithContent('items.csv', $content),
        ])->assertOk();

        $this->assertSame(['Kodas', 'Laboratorija', 'Patalpa'], $headers->json('rawHeaders'));
        $this->assertSame('ŠVIE102-P', $headers->json('sampleRows.0.0'));
    }

    private function booleanProcessor(): ImportRowProcessor
    {
        return new ImportRowProcessor(
            modelClass: InventoryItem::class,
            fieldMappings: ['kodas' => 'local_name', 'keliose_vietose' => 'multiple_locations'],
            foreignKeyLookups: null,
            locale: 'en',
            createdBy: $this->admin->id,
            updatedBy: $this->admin->id,
        );
    }

    public function test_boolean_values_are_normalized(): void
    {
        $cases = [
            'ABC001-K' => [null, false],
            'ABC002-K' => ['', false],
            'ABC003-K' => ['Taip', true],
            'ABC004-K' => ['NE', false],
            'ABC005-K' => ['TRUE', true],
            'ABC006-K' => ['false', false],
            'ABC007-K' => ['yes', true],
            'ABC008-K' => [' 1 ', true],
            'ABC009-K' => [0, false],
            'ABC010-K' => [true, true],
        ];

        $errors = $this->booleanProcessor()->process(collect($cases)->map(
            fn($case, $code) => ['kodas' => $code, 'keliose_vietose' => $case[0]]
        )->values());

        $this->assertSame([], $errors);
        foreach ($cases as $code => [, $expected]) {
            $this->assertSame($expected, (bool) InventoryItem::where('local_name', $code)->value('multiple_locations'), $code);
        }
    }

    public function test_unrecognized_boolean_value_is_rejected_with_its_original_value(): void
    {
        $errors = $this->booleanProcessor()->process(collect([
            ['kodas' => 'ABC001-K', 'keliose_vietose' => 'maybe'],
        ]));

        $this->assertCount(1, $errors);
        $this->assertSame('multiple_locations', $errors[0]['attribute']);
        $this->assertSame('maybe', $errors[0]['value']);
        $this->assertSame(0, InventoryItem::count());
    }

    public function test_boolean_column_missing_from_file_keeps_existing_value(): void
    {
        $this->booleanProcessor()->process(collect([['kodas' => 'ABC001-K', 'keliose_vietose' => 'taip']]));

        $withoutColumn = new ImportRowProcessor(
            modelClass: InventoryItem::class,
            fieldMappings: ['kodas' => 'local_name', 'pavadinimas' => 'name'],
            foreignKeyLookups: null,
            locale: 'en',
            createdBy: $this->admin->id,
            updatedBy: $this->admin->id,
        );
        $errors = $withoutColumn->process(collect([
            ['kodas' => 'ABC001-K', 'pavadinimas' => 'Renamed'],
            ['kodas' => 'ABC002-K', 'pavadinimas' => 'New item'],
        ]));

        $this->assertSame([], $errors);
        $this->assertTrue((bool) InventoryItem::where('local_name', 'ABC001-K')->value('multiple_locations'));
        $this->assertNull(InventoryItem::where('local_name', 'ABC002-K')->value('multiple_locations'));
    }

    public function test_export_writes_false_instead_of_an_empty_cell(): void
    {
        $this->booleanProcessor()->process(collect([['kodas' => 'ABC001-K', 'keliose_vietose' => 'ne']]));

        $path = tempnam(sys_get_temp_dir(), 'export_') . '.xlsx';
        file_put_contents($path, Excel::raw(new InventoryExports(), \Maatwebsite\Excel\Excel::XLSX));
        $rows = IOFactory::load($path)->getActiveSheet()->toArray(null, false, false);
        @unlink($path);

        $headerRow = collect($rows)->first(fn($row) => in_array('Keliose vietose', $row, true));
        $itemRow = collect($rows)->first(fn($row) => in_array('ABC001-K', $row, true));
        $this->assertNotNull($headerRow);
        $this->assertNotNull($itemRow);
        $this->assertFalse($itemRow[array_search('Keliose vietose', $headerRow, true)]);
    }

    public function test_formula_cells_are_read_as_their_result(): void
    {
        $spreadsheet = new Spreadsheet();
        $spreadsheet->getActiveSheet()->fromArray([
            ['Kodas', 'Keliose vietose?'],
            ['ABC001-K', '=FALSE()'],
            ['ABC002-K', '=TRUE()'],
            ['ABC003-K', '=1=1'],
            ['ABC004-K', false],
        ], null, 'A1', true);
        $path = tempnam(sys_get_temp_dir(), 'formulas_') . '.xlsx';
        (new Xlsx($spreadsheet))->save($path);
        $upload = fn() => UploadedFile::fake()->createWithContent('items.xlsx', file_get_contents($path));

        $preview = $this->actingAs($this->admin)
            ->postJson(route('imports.previewHeaders'), ['file' => $upload()])
            ->assertOk();
        $this->assertSame(['FALSE', 'TRUE', 'TRUE', 'FALSE'], array_column($preview->json('sampleRows'), 1));

        $this->actingAs($this->admin)->postJson(route('imports.dryRun'), [
            'model_class' => InventoryItem::class,
            'field_mappings' => ['kodas' => 'local_name', 'keliose_vietose' => 'multiple_locations'],
            'file' => $upload(),
        ])->assertOk()->assertJson(['passed' => true, 'total_rows' => 4, 'error_count' => 0]);

        @unlink($path);
    }

    private function trimProcessor(): ImportRowProcessor
    {
        return new ImportRowProcessor(
            modelClass: InventoryItem::class,
            fieldMappings: ['kodas' => 'local_name', 'laboratorija' => 'laboratory', 'komentarai' => 'comments'],
            foreignKeyLookups: null,
            locale: 'en',
            createdBy: $this->admin->id,
            updatedBy: $this->admin->id,
        );
    }

    public function test_leading_and_trailing_whitespace_is_trimmed(): void
    {
        $errors = $this->trimProcessor()->process(collect([[
            'kodas' => "\nŠVIE102-P ",
            'laboratorija' => "\nChemistry\u{00A0}",
            'komentarai' => "First line\nSecond line \t",
        ]]));

        $this->assertSame([], $errors);
        $item = InventoryItem::sole();
        $this->assertSame('ŠVIE102-P', $item->local_name);
        $this->assertSame(Laboratory::where('name', 'Chemistry')->value('id'), (int) $item->laboratory);
        $this->assertSame("First line\nSecond line", $item->comments);
    }

    public function test_whitespace_only_code_is_rejected_as_required(): void
    {
        $errors = $this->trimProcessor()->process(collect([['kodas' => " \n ", 'laboratorija' => null, 'komentarai' => null]]));

        $this->assertCount(1, $errors);
        $this->assertSame('local_name', $errors[0]['attribute']);
        $this->assertSame(0, InventoryItem::count());
    }

    public function test_trailing_newline_in_code_updates_the_existing_item(): void
    {
        $this->trimProcessor()->process(collect([['kodas' => 'ŠVIE102-P', 'laboratorija' => null, 'komentarai' => 'old']]));
        $this->trimProcessor()->process(collect([['kodas' => "ŠVIE102-P\n", 'laboratorija' => null, 'komentarai' => 'new']]));

        $this->assertSame(1, InventoryItem::count());
        $this->assertSame('new', InventoryItem::sole()->comments);
    }

    public function test_importable_fields_include_aliases_for_auto_mapping(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson(route('imports.importableFields', ['model' => InventoryItem::class]))
            ->assertOk();

        // Field key plus its label in every language, slugged like file headers.
        $this->assertContains('local_name', $response->json('aliases.local_name'));
        $this->assertContains('kodas', $response->json('aliases.local_name'));
        $this->assertContains('name', $response->json('aliases.name'));
        $this->assertContains('pavadinimas', $response->json('aliases.name'));
    }

    public function test_dry_run_requires_a_file_or_definition(): void
    {
        $this->actingAs($this->admin)->postJson(route('imports.dryRun'), [
            'model_class' => InventoryItem::class,
            'field_mappings' => self::MAPPING,
        ])->assertStatus(422)->assertJsonValidationErrors('file');
    }
}
