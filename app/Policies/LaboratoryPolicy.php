<?php

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Models\Laboratory;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LaboratoryPolicy
{

    public function delete(User $user, Laboratory $laboratory): Response
    {
        return $user->hasRole(RoleEnum::SUPER_ADMIN) ? Response::allow() : Response::deny(__('validation.unauthorized_admin'));
    }
}
