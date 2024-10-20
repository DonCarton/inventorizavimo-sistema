<?php

namespace App\Http\Requests\UpdateRequests;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UpdateUserRequest extends FormRequest
{
    private bool $invalidRole = false;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->user()->id == $this->route('user')->id && !$this->route('user')->hasRole($this->role) ) {
            $this->invalidRole = true;
            return false;
        } else if ($this->role != RoleEnum::SUPER_ADMIN) {
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
        if ($this->invalidRole) {
            throw ValidationException::withMessages([
               'role' => __('validation.custom.selectedRole.unauthorized_role_change')
            ]);
        }
        throw ValidationException::withMessages([
            'role' => __('validation.custom.selectedRole.can')
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user')->id;
        return [
            'first_name' => ['required','string','max:50'],
            'last_name' => ['required','string','max:50'],
            'email' => ['required','string','lowercase','email','max:60',Rule::unique('users')->ignore($userId)->whereNull('deleted_at')],
            'laboratory' => ['required','integer','exists:laboratories,id'],
            'role' => 'required|exists:roles,id',
            'updated_by' => ['required']
        ];
    }
}
