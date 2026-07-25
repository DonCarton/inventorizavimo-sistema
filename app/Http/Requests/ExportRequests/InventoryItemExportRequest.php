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
            'inventory_type' => 'nullable|integer|string',
            'laboratory' => 'nullable|string',
            'updated_by' => 'nullable|string',
            //'sort_field' => 'nullable|string|in:local_name,name,name_eng,inventory_type,laboratory,updated_by',
            //'sort_direction' => 'nullable|string|in:asc,desc',
        ];
    }
}
