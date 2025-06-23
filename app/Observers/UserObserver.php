<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;

class UserObserver implements ShouldHandleEventsAfterCommit
{

    public function updated(User $user)
    {
        if ($user->isDirty('laboratory') && $user->laboratory !== null) {
            
            $laboratory = $user->belongsToLaboratory()->with('facilities')->first();

            if ($laboratory) {

                $facilityIds = $laboratory->facilities->pluck('id')->toArray();
                $user->facilities()->sync($facilityIds);
            
            }
        }
    }

    public function deleting(User $user)
    {
        if ($user->isForceDeleting()) {
            return;
        }

        $baseEmail = 'DELETED_' . $user->email;
        $uniqueEmail = $baseEmail;
        $counter = 1;

        while (User::withTrashed()->where('email', $uniqueEmail)->exists()) {

            $uniqueEmail = 'DELETED_' . $counter . '_' . $user->email;
            $counter++;
        }

        $user->email = $uniqueEmail;
        $user->roles()->detach();
        $user->save();
    }
}
