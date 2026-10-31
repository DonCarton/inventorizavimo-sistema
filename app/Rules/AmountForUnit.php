<?php

namespace App\Rules;

use App\Models\InventoryItem;
use App\Models\MeasurementUnit;
use App\Support\ItemCode;
use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * An amount may not have more decimals than its unit allows (P = whole numbers,
 * K = up to 3 decimals, ...). Without a given unit, it is resolved from the row being
 * validated (imports): the existing item's unit, else the unit matching the code suffix.
 * Items without a unit are not restricted.
 */
class AmountForUnit implements ValidationRule, DataAwareRule
{
    protected array $data = [];

    public function __construct(protected ?MeasurementUnit $unit = null)
    {
    }

    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '' || !is_numeric($value)) {
            return;
        }

        $unit = $this->unit ?? $this->unitFromRow();

        if (!$unit || MeasurementUnit::decimalsIn($value) <= $unit->decimal_places) {
            return;
        }

        $fail($unit->decimal_places === 0
            ? 'validation.custom.amount.whole_numbers'
            : 'validation.custom.amount.decimal_places'
        )->translate(['unit' => $unit->name, 'decimals' => $unit->decimal_places]);
    }

    protected function unitFromRow(): ?MeasurementUnit
    {
        $code = $this->data['local_name'] ?? null;
        if (!is_string($code) || $code === '') {
            return null;
        }

        return InventoryItem::where('local_name', $code)->first()?->measurementUnit
            ?? MeasurementUnit::where('code', ItemCode::unitCode($code))->first();
    }
}
