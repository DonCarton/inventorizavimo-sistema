<?php

namespace App\Http\Requests\StoreRequests;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryItemRequest extends FormRequest
{
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
        return [
            'local_name' => ['required'],
            'inventory_type' => ['required'],
            'name' => ['required', 'string', 'max:255'],
            'name_eng' => ['required', 'string', 'max:255'],
            'formula',
            'cas_nr',
            'user_guide',
            'provider',
            'product_code',
            'barcode',
            'url_to_provider',
            'alt_url_to_provider',
            'total_count' => ['required', 'int', 'min:1'],
            'critical_amount' => ['required', 'int', 'lt:total_count'],
            'multiple_locations' => ['boolean'],
            'laboratory' => ['required', 'int'],
            'storage_conditions',
            'asset_number',
            'used_for',
            'comments',
            'created_by' => 'required|exists:users,id',
            'updated_by' => 'required|exists:users,id',
        ];
    }
}
