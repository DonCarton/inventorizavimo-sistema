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
            'local_name' => ['required', 'unique:inventory_items,local_name'],
            'inventory_type' => 'required:exists:item_types,id',
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
            'total_amount' => ['required', 'numeric', 'min:0'],
            'critical_amount' => ['required', 'numeric'],
            'to_order_amount' => ['nullable', 'numeric'],
            'multiple_locations' => ['boolean'],
            'laboratory' => 'required:exists:laboratories,id',
            'cupboard' => 'nullable|exists:inventory_items,id',
            'shelf' => 'nullable|exists:inventory_items,id',
            'storage_conditions' => ['nullable', 'string'],
            'asset_number' => 'required_unless:asset_number_required,false',
            'used_for' => ['nullable', 'string'],
            'comments' => ['nullable', 'string'],
            'created_by' => 'required|exists:users,id',
            'updated_by' => 'required|exists:users,id',
        ];
    }
}
