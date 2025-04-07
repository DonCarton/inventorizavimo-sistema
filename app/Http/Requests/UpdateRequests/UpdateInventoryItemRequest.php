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
            'name_eng' => ['required', 'min:2', 'max:255'],
            'inventory_type' => 'required:exists:item_types,id',
            'laboratory' => 'required:exists:laboratories,id',
            'formula' => ['nullable', 'string'],
            'cas_nr' => ['nullable', 'string'],
            'user_guide' => ['nullable', 'string'],
            'provider' => ['nullable', 'string'],
            'product_code' => ['nullable', 'string'],
            'barcode' => ['nullable', 'string'],
            'url_to_provider' => ['nullable', 'string'],
            'alt_url_to_provider' => ['nullable', 'string'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'critical_amount' => ['nullable','numeric'],
            'to_order_amount' => ['nullable','numeric'],
            'average_consumption' => ['nullable','numeric'],
            'multiple_locations' => ['boolean'],
            'cupboard' => ['nullable','string'],
            'shelf' => ['nullable','int'],
            'storage_conditions' => ['nullable','string'],
            'asset_number' => ['nullable','string'],
            'used_for' => ['nullable', 'string'],
            'comments' => ['nullable', 'string'],
            'updated_by' => 'required|exists:users,id'
        ];
    }
}
