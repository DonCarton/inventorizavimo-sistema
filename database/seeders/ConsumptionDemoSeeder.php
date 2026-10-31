<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Development only: fills consumption history for consumable items so the usage
 * chart and average consumption have something to show.
 *
 *   php artisan db:seed --class=ConsumptionDemoSeeder
 *
 * Replaces the consumption history of every consumable item, so it refuses to run
 * in production. The data is deterministic (same output on every run).
 */
class ConsumptionDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->environment('production')) {
            $this->command?->error('ConsumptionDemoSeeder must not run in production.');
            return;
        }

        mt_srand(42);

        $items = InventoryItem::with(['itemType', 'measurementUnit'])->get()
            ->filter(fn(InventoryItem $item) => $item->itemType?->change_acc_amount)
            ->values();

        $now = now();
        $windowStart = InventoryItem::consumptionWindowStart();

        foreach ($items as $index => $item) {
            DB::table('consumption_logs')->where('inventory_item_id', $item->id)->delete();

            // Vary the shape between items: full history, used only recently, or with a quiet summer.
            $firstMonth = match ($index % 3) {
                0 => 0,   // used all year
                1 => 7,   // first used 5 months ago
                2 => 2,
            };
            $decimals = $item->measurementUnit?->decimal_places ?? 3;
            $rows = [];

            for ($month = $firstMonth; $month < InventoryItem::CONSUMPTION_MONTHS; $month++) {
                $monthStart = $windowStart->copy()->addMonths($month);
                $isSummer = in_array($monthStart->month, [7, 8], true);
                $entries = $isSummer && $index % 3 === 2 ? 0 : mt_rand(1, 4);

                for ($n = 0; $n < $entries; $n++) {
                    $amount = $decimals === 0
                        ? mt_rand(1, 3)
                        : round(mt_rand(50, 1500) / 1000, $decimals);
                    $day = min(mt_rand(1, $monthStart->daysInMonth), $monthStart->isSameMonth($now) ? $now->day : 31);
                    $at = $monthStart->copy()->day($day)->setTime(mt_rand(8, 17), mt_rand(0, 59));

                    $rows[] = [
                        'inventory_item_id' => $item->id,
                        'amount' => $amount,
                        'created_by' => $item->updated_by,
                        'created_at' => $at,
                        'updated_at' => $at,
                    ];
                }
            }

            DB::table('consumption_logs')->insert($rows);
            $this->command?->info(sprintf('%s: %d entries, average %s %s / month',
                $item->local_name, count($rows), $item->averageMonthlyConsumption() ?? '-', $item->measurementUnit?->code));
        }
    }
}
