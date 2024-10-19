<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function update(User $authUser, User $targetUser): Response
    {
        return $authUser->hasRole('super-admin') ? Response::allow() : Response::deny(__('validation.unauthorized_admin'));
    }
    public function delete(User $authUser, User $targetUser): Response
    {
        return $authUser->hasRole('super-admin') ? Response::allow() : Response::deny(__('validation.unauthorized_admin'));
    }
}
