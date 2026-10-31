<?php

namespace App\Http\Requests\UpdateRequests;

use App\Models\MeasurementUnit;
use App\Support\ItemCode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMeasurementUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => mb_strtoupper(trim((string) $this->input('code'))),
        ]);
    }

    public function rules(): array
    {
        return [
            'code' => [
                'required',
                'regex:' . ItemCode::UNIT_CODE_PATTERN,
                Rule::unique('measurement_units', 'code')->ignore($this->route('measurementUnit')),
            ],
            'name' => ['required', 'string', 'max:100'],
            'decimal_places' => ['sometimes', 'integer', 'between:0,' . MeasurementUnit::MAX_DECIMAL_PLACES],
            'is_active' => ['boolean'],
            'updated_by' => 'required|exists:users,id',
        ];
    }
}
