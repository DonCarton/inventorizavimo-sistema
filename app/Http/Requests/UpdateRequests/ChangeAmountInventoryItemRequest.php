<?php

namespace App\Http\Requests\UpdateRequests;

use App\Rules\AmountForUnit;
use App\Rules\NonNegativeAmount;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ChangeAmountInventoryItemRequest extends FormRequest
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
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        $item = $this->route('inventoryItem');
        $unitRule = new AmountForUnit($item?->measurementUnit);

        return [
            'amount_added' => ['required_without:amount_removed', 'nullable', 'numeric', 'gt:0', $unitRule],
            'amount_removed' => ['required_without:amount_added', 'nullable', 'numeric', 'gt:0', $unitRule, new NonNegativeAmount((float) $item?->total_amount)],
            'urlToRedirect' => 'boolean',
            'updated_by' => 'required|exists:users,id'
        ];
    }
}
