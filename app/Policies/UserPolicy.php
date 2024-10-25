<?php

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function viewAny(User $user): Response
    {
        return $user->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN]) ? Response::allow() : Response::deny(__('validation.unauthorized'));
    }
    public function create(User $user): Response
    {
        return $user->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN]) ? Response::allow() : Response::deny(__('validation.unauthorized'));
    }
    public function store(User $user): Response
    {
        return $user->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN]) ? Response::allow() : Response::deny(__('validation.unauthorized'));
    }
    public function edit(User $authUser, User $targetUser): Response
    {
        if ($targetUser->hasRole(RoleEnum::SUPER_ADMIN) && !$authUser->hasRole(RoleEnum::SUPER_ADMIN)) {
            return Response::deny(__('validation.unauthorized_admin'));
        } else if (!$authUser->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN])) {
            return Response::deny(__('validation.unauthorized'));
        }
        return Response::allow();
    }
    public function update(User $authUser, User $targetUser): Response
    {
        if ($targetUser->hasRole(RoleEnum::SUPER_ADMIN) && !$authUser->hasRole(RoleEnum::SUPER_ADMIN)) {
            return Response::deny(__('validation.unauthorized_admin'));
        } else if (!$authUser->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN])) {
            return Response::deny(__('validation.unauthorized'));
        }
        return Response::allow();
    }
    public function delete(User $authUser, User $targetUser): Response
    {
        if ($targetUser->hasRole(RoleEnum::SUPER_ADMIN) && !$authUser->hasRole(RoleEnum::SUPER_ADMIN)) {
            return Response::deny(__('validation.unauthorized_admin'));
        } else if (!$authUser->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN])) {
            return Response::deny(__('validation.unauthorized'));
        } else if ($targetUser->id === $authUser->id) {
            return Response::deny(__('actions.user.selfDelete'));
        }
        return Response::allow();
    }
    public function activate(User $authUser, User $targetUser): Response
    {
        if ($targetUser->hasRole(RoleEnum::SUPER_ADMIN) && !$authUser->hasRole(RoleEnum::SUPER_ADMIN)) {
            return Response::deny(__('validation.unauthorized_admin'));
        } else if (!$authUser->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN])) {
            return Response::deny(__('validation.unauthorized'));
        }
        return Response::allow();
    }
    public function deactivate(User $authUser, User $targetUser): Response
    {
        if ($targetUser->hasRole(RoleEnum::SUPER_ADMIN) && !$authUser->hasRole(RoleEnum::SUPER_ADMIN)) {
            return Response::deny(__('validation.unauthorized_admin'));
        } else if (!$authUser->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN])) {
            return Response::deny(__('validation.unauthorized'));
        }
        return Response::allow();
    }
    public function changeRole(User $authUser, User $targetUser): Response
    {
        if ($targetUser->id === $authUser->id && $authUser->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN])) {
            return Response::deny(__('validation.custom.selectedRole.unauthorized_role_change'));
        } else if ($targetUser->hasRole(RoleEnum::SUPER_ADMIN) && !$authUser->hasRole(RoleEnum::SUPER_ADMIN)) {
            return Response::deny(__('validation.unauthorized_admin'));
        }
        return Response::allow();
    }
}
