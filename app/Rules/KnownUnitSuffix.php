<?php

namespace App\Rules;

use App\Models\InventoryItem;
use App\Models\MeasurementUnit;
use App\Support\ItemCode;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * The code's unit suffix must belong to a known measurement unit. Codes of items
 * that already exist are always accepted, so re-importing old codes keeps working
 * after a unit's code was renamed (existing codes keep their old suffix).
 */
class KnownUnitSuffix implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value)) {
            return;
        }

        $unitCode = ItemCode::unitCode($value);

        if ($unitCode && MeasurementUnit::where('code', $unitCode)->exists()) {
            return;
        }

        if (InventoryItem::where('local_name', $value)->exists()) {
            return;
        }

        $fail('validation.custom.local_name.unknown_unit')->translate([
            'units' => MeasurementUnit::where('is_active', true)->orderBy('code')->pluck('code')->implode(', '),
        ]);
    }
}
