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
 *
 * A value equal to what is already stored is always accepted, so items with legacy
 * amounts (e.g. 2.5 packages from before units had decimal places) can still be saved
 * and re-imported; only new amounts must follow the unit.
 */
class AmountForUnit implements ValidationRule, DataAwareRule
{
    protected array $data = [];

    /**
     * @param MeasurementUnit|null $unit unit to check against; resolved from the row when null
     * @param float|null $storedValue the item's current value for this field; unchanged values pass
     */
    public function __construct(protected ?MeasurementUnit $unit = null, protected ?float $storedValue = null)
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

        if ($this->isUnchanged($value, $this->storedValue)) {
            return;
        }

        $unit = $this->unit;
        if (!$unit) {
            [$unit, $stored] = $this->unitAndStoredValueFromRow($attribute);
            if ($this->isUnchanged($value, $stored)) {
                return;
            }
        }

        if (!$unit || MeasurementUnit::decimalsIn($value) <= $unit->decimal_places) {
            return;
        }

        $fail($unit->decimal_places === 0
            ? 'validation.custom.amount.whole_numbers'
            : 'validation.custom.amount.decimal_places'
        )->translate(['unit' => $unit->name, 'decimals' => $unit->decimal_places]);
    }

    protected function isUnchanged(mixed $value, ?float $stored): bool
    {
        return $stored !== null && abs((float) $value - $stored) < 1e-9;
    }

    /**
     * For a row being imported: the unit (existing item's, else from the code suffix)
     * and the existing item's current value of the validated field.
     *
     * @return array{0: ?MeasurementUnit, 1: ?float}
     */
    protected function unitAndStoredValueFromRow(string $attribute): array
    {
        $code = $this->data['local_name'] ?? null;
        if (!is_string($code) || $code === '') {
            return [null, null];
        }

        $existing = InventoryItem::with('measurementUnit')->where('local_name', $code)->first();
        if ($existing) {
            $stored = $existing->getAttribute($attribute);
            return [$existing->measurementUnit, $stored === null ? null : (float) $stored];
        }

        return [MeasurementUnit::where('code', ItemCode::unitCode($code))->first(), null];
    }
}
