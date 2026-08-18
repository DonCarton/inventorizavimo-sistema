<?php

namespace App\Http\Requests\UpdateRequests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemTypeRequest extends FormRequest
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
            'name' => 'required|min:3|max:100',
            'change_acc_amount' => 'required|boolean',
            'min_loan_term_days' => ['nullable', 'integer', 'min:0'],
            'max_loan_term_days' => ['nullable', 'integer', 'min:0', 'gte:min_loan_term_days'],
            'updated_by' => 'required|exists:users,id'
        ];
    }
}
