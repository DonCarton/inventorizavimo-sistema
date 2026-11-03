<?php

namespace App\Models;

use App\Support\ItemCode;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A unit an inventory item is measured in (e.g. K = kilograms). Its code is the
 * suffix of new item codes. Renaming the code does not rewrite existing codes;
 * items stay linked through measurement_unit_id.
 *
 * @property int $id
 * @property string $code
 * @property string $name
 * @property bool $is_active
 * @property int $decimal_places
 */
class MeasurementUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'decimal_places',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'decimal_places' => 'integer',
    ];

    public const MAX_DECIMAL_PLACES = 3;

    /**
     * Rounds an amount to the decimals this unit allows (also clears float leftovers
     * such as 0.30000000000000004 after repeated subtraction).
     */
    public function round(float $value): float
    {
        return round($value, $this->decimal_places);
    }

    /**
     * Number of decimals actually used by a value: "2.50" -> 1, "3" -> 0, "0.125" -> 3.
     */
    public static function decimalsIn(mixed $value): int
    {
        $normalized = rtrim(rtrim(sprintf('%.10F', (float) $value), '0'), '.');
        $dot = strpos($normalized, '.');

        return $dot === false ? 0 : strlen($normalized) - $dot - 1;
    }

    public function inventoryItems(): HasMany
    {
        return $this->hasMany(InventoryItem::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by')->withTrashed();
    }

    /**
     * Links items that have no unit yet to the unit matching their code suffix.
     * Returns how many items are still without a unit afterwards.
     */
    public static function linkItemsBySuffix(): int
    {
        $unitIds = static::query()->pluck('id', 'code');

        InventoryItem::query()
            ->whereNull('measurement_unit_id')
            ->select(['id', 'local_name'])
            ->chunkById(500, function ($items) use ($unitIds) {
                foreach ($items as $item) {
                    $unitId = $unitIds[ItemCode::unitCode($item->local_name)] ?? null;
                    if ($unitId) {
                        // Query-builder update: no model events, no activity log entries for the backfill.
                        InventoryItem::query()->whereKey($item->id)->update(['measurement_unit_id' => $unitId]);
                    }
                }
            });

        return InventoryItem::query()->whereNull('measurement_unit_id')->count();
    }
}
