<?php

namespace App\Observers;

use App\LogsPivotChanges;
use App\Models\User;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;

class UserObserver implements ShouldHandleEventsAfterCommit
{
    use LogsPivotChanges;

    public static function syncLaboratories(User $user, array $laboratoryIds): void
    {
        $syncResult = $user->laboratories()->sync($laboratoryIds);
        self::logPivotSync($user, 'laboratories', $syncResult);
        $user->syncFacilitiesFromLaboratories();
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

        $user->facilities()->detach();

        $user->email = $uniqueEmail;
        $user->roles()->detach();
        $user->save();
    }
}
