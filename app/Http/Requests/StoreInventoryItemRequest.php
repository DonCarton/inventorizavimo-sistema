<?php

namespace App\Http\Requests;

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
            'name' => ['required', 'string', 'max:255'],
            'name_eng' => ['required', 'string', 'max:255'],
            'total_count' => ['required', 'int', 'min:1'],
            'barcode' => ['required'],
            'critical_amount' => ['required', 'int', 'lt:total_count'],
            'laboratory' => ['required', 'int'],
        ];
    }
}
