<?php

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function edit(User $authUser, User $user): Response
    {
        if ($authUser->hasRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN])){
            return Response::allow();
        } else if ($authUser->id === $user->id){
            return Response::allow();
        }
        return Response::deny(__('validation.unauthorized'));
    }
    public function update(User $authUser, User $targetUser): Response
    {
        return $authUser->hasRole(RoleEnum::SUPER_ADMIN) ?
            Response::allow() :
            Response::deny(__('validation.unauthorized_admin'));
    }
    public function delete(User $authUser, User $targetUser): Response
    {
        return $authUser->hasRole(RoleEnum::SUPER_ADMIN) ?
            Response::allow() :
            Response::deny(__('validation.unauthorized_admin'));
    }
}
