<?php

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Models\MeasurementUnit;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MeasurementUnitPolicy
{
    public function viewAny(User $user): Response
    {
        return $user->hasAnyRole([RoleEnum::ADMIN, RoleEnum::SUPER_ADMIN]) ? Response::allow() : Response::deny(__('validation.unauthorized'));
    }

    public function create(User $user): Response
    {
        return $user->hasRole(RoleEnum::SUPER_ADMIN) ? Response::allow() : Response::deny(__('validation.unauthorized_admin'));
    }

    public function update(User $user, MeasurementUnit $measurementUnit): Response
    {
        return $user->hasRole(RoleEnum::SUPER_ADMIN) ? Response::allow() : Response::deny(__('validation.unauthorized_admin'));
    }

    public function delete(User $user, MeasurementUnit $measurementUnit): Response
    {
        return $this->update($user, $measurementUnit);
    }
}
