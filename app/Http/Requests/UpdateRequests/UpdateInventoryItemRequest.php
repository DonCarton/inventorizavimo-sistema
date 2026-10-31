<?php

namespace App\Http\Requests\UpdateRequests;

use App\Enums\RoleEnum;
use App\Models\InventoryItem;
use App\Models\MeasurementUnit;
use App\Rules\AmountForUnit;
use App\Support\ItemCode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInventoryItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Amounts follow the unit the item will have after saving.
        $unit = MeasurementUnit::find($this->input('measurement_unit_id')) ?? $this->route('inventoryItem')?->measurementUnit;

        return [
            'local_name' => ['required', Rule::unique('inventory_items', 'local_name')->ignore($this->route('inventoryItem'))],
            'measurement_unit_id' => ['nullable', 'exists:measurement_units,id'],
            'name' => ['required', 'min:2', 'max:255'],
            'name_eng' => ['required', 'min:2', 'max:255'],
            'inventory_type' => 'required:exists:item_types,id',
            'laboratory' => 'required:exists:laboratories,id',
            'facilities' => ['nullable','exists:facilities,id'],
            'formula' => ['nullable', 'string'],
            'cas_nr' => ['nullable', 'string'],
            'user_guide' => ['nullable', 'string'],
            'provider' => ['nullable', 'string'],
            'product_code' => ['nullable', 'string'],
            'barcode' => ['nullable', 'string'],
            'url_to_provider' => ['nullable', 'string'],
            'alt_url_to_provider' => ['nullable', 'string'],
            'total_amount' => ['required', 'numeric', 'min:0', new AmountForUnit($unit)],
            'critical_amount' => ['nullable', 'numeric', new AmountForUnit($unit)],
            'to_order_amount' => ['nullable', 'numeric', new AmountForUnit($unit)],
            'multiple_locations' => ['boolean'],
            'cupboard' => ['nullable','numeric','between:1,50'],
            'shelf' => ['nullable','string'],
            'storage_conditions' => ['nullable','string'],
            'asset_number' => ['nullable','string'],
            'used_for' => ['nullable', 'string'],
            'comments' => ['nullable', 'string'],
            'min_loan_term_days' => ['nullable', 'integer', 'min:0'],
            'max_loan_term_days' => ['nullable', 'integer', 'min:0', 'gte:min_loan_term_days'],
            'updated_by' => 'required|exists:users,id'
        ];
    }

    /**
     * Only users who may alter codes can change the code or the unit. Changing the
     * unit rewrites the code's suffix (ŠVIE102-P -> ŠVIE102-K); everyone else keeps
     * the item's current code and unit whatever the request contains.
     */
    protected function prepareForValidation(): void
    {
        /** @var InventoryItem $item */
        $item = $this->route('inventoryItem');

        if (!$this->user()?->hasAnyRole([RoleEnum::ADMIN, RoleEnum::SUPER_ADMIN])) {
            $this->merge([
                'local_name' => $item->local_name,
                'measurement_unit_id' => $item->measurement_unit_id,
            ]);
            return;
        }

        $unitId = $this->input('measurement_unit_id');
        $localName = $this->input('local_name') ?: $item->local_name;

        if ($unitId && (int) $unitId !== (int) $item->measurement_unit_id && ($unit = MeasurementUnit::find($unitId))) {
            $localName = ItemCode::withUnit($localName, $unit->code);
        }

        $this->merge(['local_name' => $localName]);
    }
}
