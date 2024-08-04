<?php

namespace App\Http\Requests;

use App\Enums\ModelTypeValid;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * @property int $per_page
 * @property int $object_id
 * @property string $object_type
 */
class HistoryLogRequest extends FormRequest
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
            'object_id' => 'required|integer',
            'object_type' => [Rule::enum(ModelTypeValid::class)],
            'per_page' => 'integer|min:10|max:50',
            'page' => 'integer',
        ];
    }
}
