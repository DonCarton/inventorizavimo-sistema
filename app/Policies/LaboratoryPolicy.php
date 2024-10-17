<?php

namespace App\Policies;

use App\Models\Laboratory;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LaboratoryPolicy
{
    public function viewAny(User $user): bool
    {
        //
    }

    public function view(User $user, Laboratory $laboratory): bool
    {
        //
    }

    public function create(User $user): bool
    {
        //
    }

    public function update(User $user, Laboratory $laboratory): bool
    {
        //
    }

    public function delete(User $user, Laboratory $laboratory): bool
    {
        return $user->hasRole('super-admin');
    }

    public function restore(User $user, Laboratory $laboratory): bool
    {
        //
    }

    public function forceDelete(User $user, Laboratory $laboratory): bool
    {
        //
    }
}
