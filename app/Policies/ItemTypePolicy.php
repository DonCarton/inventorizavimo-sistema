<?php

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Models\ItemType;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ItemTypePolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->hasRole(RoleEnum::SUPER_ADMIN) || $user->hasRole(RoleEnum::ADMIN) ?
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
