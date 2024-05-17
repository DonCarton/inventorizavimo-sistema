<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdjustInventoryAmountViaLog extends FormRequest
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
            'laboratory_id' => 'required|exists:laboratories,id',
            'action' => ['required', Rule::in(['REMOVE', 'RETURN'])],
            'amount' => [
                'required',
                'integer',
                'min:1',
//                'lte:total_available'
            ]
        ];
    }
}
