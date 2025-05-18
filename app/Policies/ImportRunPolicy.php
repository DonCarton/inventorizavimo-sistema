<?php

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Models\ImportRun;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ImportRunPolicy
{
    public function viewAny(User $user): Response
    {
        return $user->hasAnyRole([RoleEnum::ADMIN,RoleEnum::USER,RoleEnum::SUPER_ADMIN]) ? Response::allow() : Response::deny(__('validation.unauthorized'));
    }
    public function create(User $user): Response
    {
        return $user->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN]) ?
            Response::allow() :
            Response::deny(__('validation.unauthorized'));
    }
    public function edit(User $user, ImportRun $inventoryItem): Response
    {
        return $user->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN]) ?
            Response::allow() :
            Response::deny(__('validation.unauthorized'));
    }
    public function delete(User $user, ImportRun $inventoryItem): Response
    {
        return $user->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN]) ?
            Response::allow() :
            Response::deny(__('validation.unauthorized'));
    }
}
