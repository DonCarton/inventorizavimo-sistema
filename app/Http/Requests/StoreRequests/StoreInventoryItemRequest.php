<?php

namespace App\Http\Requests\StoreRequests;

use App\Models\ItemType;
use App\Models\MeasurementUnit;
use App\Rules\AmountForUnit;
use App\Rules\AssetNumberRequired;
use App\Support\ItemCode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInventoryItemRequest extends FormRequest
{
    protected $type;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, Rule|array|string>
     */
    public function rules(): array
    {
        $preliminaryRules = [
            'inventory_type' => ['required','exists:item_types,id'],
        ];
        if ($this->type) {
            $unit = MeasurementUnit::find($this->input('measurement_unit_id'));
            $additionalRules = [
                'measurement_unit_id' => ['required', Rule::exists('measurement_units', 'id')->where('is_active', true)],
                'local_name' => ['required', 'unique:inventory_items,local_name'],
                'name' => ['required', 'string', 'max:255'],
                'name_eng' => ['required', 'string', 'max:255'],
                'formula' => ['nullable', 'string'],
                'cas_nr' => ['nullable', 'string'],
                'user_guide' => ['nullable', 'string'],
                'provider' => ['nullable', 'string'],
                'product_code' => ['nullable', 'string'],
                'barcode' => ['nullable', 'string'],
                'url_to_provider' => ['nullable', 'string'],
                'alt_url_to_provider' => ['nullable', 'string'],
                'total_amount' => ['required', 'numeric', 'min:0', new AmountForUnit($unit)],
                'critical_amount' => ['required', 'numeric', new AmountForUnit($unit)],
                'to_order_amount' => ['nullable', 'numeric', new AmountForUnit($unit)],
                'multiple_locations' => ['boolean'],
                'laboratory' => 'required:exists:laboratories,id',
                'facilities' => 'required:exists:facilities,id',
                'cupboard' => 'nullable|numeric|between:1,50',
                'shelf' => 'nullable|string',
                'storage_conditions' => ['nullable', 'string'],
                'asset_number' => ['', new AssetNumberRequired($this->type)],
                'used_for' => ['nullable', 'string'],
                'comments' => ['nullable', 'string'],
                'created_by' => 'required|exists:users,id',
                'updated_by' => 'required|exists:users,id',
            ];
            return array_merge($preliminaryRules, $additionalRules);
        }
        return $preliminaryRules;
    }
    protected function prepareForValidation(): void
    {
        $this->type = $this->input('inventory_type') ? ItemType::find($this->input('inventory_type')) : null;

        // The server decides the unit suffix of the code from the chosen unit, so the
        // uniqueness check below runs on the code that will actually be saved.
        $unit = $this->input('measurement_unit_id') ? MeasurementUnit::find($this->input('measurement_unit_id')) : null;
        if ($unit && is_string($this->input('local_name')) && $this->input('local_name') !== '') {
            $this->merge(['local_name' => ItemCode::withUnit($this->input('local_name'), $unit->code)]);
        }
    }
}
