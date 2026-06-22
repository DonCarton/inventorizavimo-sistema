<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Laboratory;
use App\Models\User;
use Illuminate\Database\Seeder;

class SeedInventoryItems extends Seeder
{
    /**
     * How many inventory items to create per laboratory.
     */
    private const ITEMS_PER_LABORATORY = 10;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $laboratories = Laboratory::query()->with('facilities')->get();

        if ($laboratories->isEmpty() || ItemType::query()->count() === 0) {
            $this->command->warn('No laboratories or item types found - run SeedLabsAndFacs and DatabaseSeeder first.');
            return;
        }

        $systemUserId = User::system()->id;
        $cupboards = range(1, 20);
        $shelves = range('A', 'F');

        foreach ($laboratories as $laboratory) {
            for ($i = 0; $i < self::ITEMS_PER_LABORATORY; $i++) {
                $inventoryItem = InventoryItem::factory()->create([
                    'laboratory' => $laboratory->id,
                    'cupboard' => (string) fake()->randomElement($cupboards),
                    'shelf' => fake()->randomElement($shelves),
                    'created_by' => $systemUserId,
                    'updated_by' => $systemUserId,
                ]);

                if ($laboratory->facilities->isNotEmpty()) {
                    $facilityIds = $laboratory->facilities
                        ->random(min(fake()->numberBetween(1, 2), $laboratory->facilities->count()))
                        ->pluck('id')
                        ->all();
                    $inventoryItem->facilities()->sync($facilityIds);
                }
            }
            $this->command->info("Seeded " . self::ITEMS_PER_LABORATORY . " inventory items for lab '{$laboratory->name}'");
        }
    }
}
