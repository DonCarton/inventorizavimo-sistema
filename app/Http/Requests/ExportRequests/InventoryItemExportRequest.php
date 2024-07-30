<?php

namespace App\Http\Requests\ExportRequests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryItemExportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'local_name' => 'nullable|string',
            'name' => 'nullable|string',
            'name_eng' => 'nullable|string',
            'inventory_type' => 'nullable|string',
            'laboratory' => 'nullable|string',
            'updated_by' => 'nullable|string',
        ];
    }
}
