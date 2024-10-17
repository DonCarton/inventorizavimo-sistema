<?php

namespace App\Http\Requests\StoreRequests;

use App\Enums\RoleEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->selectedRole != RoleEnum::SUPER_ADMIN) {
            return true;
        } else {
            return $this->user()->can('overrule-all');
        }
    }

    /**
     * @throws ValidationException
     */
    protected function failedAuthorization()
    {
        throw ValidationException::withMessages([
            'selectedRole' => __('validation.custom.selectedRole.can')
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required','string','max:50'],
            'last_name' => ['required','string','max:50'],
            'email' => ['required','string','lowercase','email','max:60',Rule::unique('users')->whereNull('deleted_at')],
            'laboratory' => 'required',
            'selectedRole' => 'required|exists:roles,id',
        ];
    }
}
