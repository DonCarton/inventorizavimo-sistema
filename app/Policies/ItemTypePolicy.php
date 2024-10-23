<?php

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Models\ItemType;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ItemTypePolicy
{
    public function viewAny(User $user): Response
    {
        return $user->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN]) ? Response::allow() : Response::deny(__('validation.unauthorized'));
    }
    public function create(User $user): Response
    {
        return $user->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN]) ?
            Response::allow() :
            Response::deny(__('validation.unauthorized'));
    }
    public function delete(User $user, ItemType $itemType): Response
    {
        return $user->hasRole(RoleEnum::SUPER_ADMIN) ?
            Response::allow() :
            Response::deny(__('validation.unauthorized_admin'));
    }
}
