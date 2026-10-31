<?php

namespace App\Http\Requests\StoreRequests;

use App\Models\MeasurementUnit;
use App\Support\ItemCode;
use Illuminate\Foundation\Http\FormRequest;

class StoreMeasurementUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Codes are stored trimmed and uppercase ("pk " -> "PK").
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => mb_strtoupper(trim((string) $this->input('code'))),
        ]);
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'regex:' . ItemCode::UNIT_CODE_PATTERN, 'unique:measurement_units,code'],
            'name' => ['required', 'string', 'max:100'],
            'decimal_places' => ['sometimes', 'integer', 'between:0,' . MeasurementUnit::MAX_DECIMAL_PLACES],
            'is_active' => ['boolean'],
            'created_by' => 'required|exists:users,id',
            'updated_by' => 'required|exists:users,id',
        ];
    }
}
