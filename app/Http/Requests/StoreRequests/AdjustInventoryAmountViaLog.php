<?php

namespace App\Http\Requests\StoreRequests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property string $action
 * @property float $amount
 * @property int $laboratory_id
 * @property string $comment
 * @property int $created_by
 * @property int $updated_by
 * @property boolean $urlToRedirect
 */
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
            ],
            'comment' => ['required', 'min:5', 'max:100'],
            'created_by' => 'required|exists:users,id',
            'updated_by' => 'required|exists:users,id',
            'urlToRedirect' => 'boolean',
        ];
    }
}
