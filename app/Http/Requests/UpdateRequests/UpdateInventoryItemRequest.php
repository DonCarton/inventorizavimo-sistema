<?php

namespace App\Http\Requests\UpdateRequests;

use Illuminate\Foundation\Http\FormRequest;

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
        return [
            'name' => ['required', 'min:2', 'max:255'],
            'name_eng',
            'inventory_type',
            'laboratory' => 'required:exists:laboratories:id',
            'formula',
            'cas_nr',
            'user_guide',
            'provider',
            'product_code',
            'barcode',
            'url_to_provider',
            'alt_url_to_provider',
            'total_count' => ['required', 'int', 'min:1'],
            'critical_amount' => ['required', 'int', 'min:1', 'lt:total_count'],
            'to_order',
            'average_consumption',
            'multiple_locations',
            'cupboard',
            'shelf',
            'storage_conditions',
            'asset_number',
            'used_for',
            'comments',
            'updated_by' => 'required|exists:users,id'
        ];
    }
}
