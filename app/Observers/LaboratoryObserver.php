<?php

namespace App\Observers;

use App\Models\Laboratory;

class LaboratoryObserver
{
    public static function syncUserFacilities(Laboratory $laboratory)
    {
        $facilityIds = $laboratory->facilities()->pluck('id')->all();

        foreach ($laboratory->users as $user)
        {
            $user->facilities()->sync($facilityIds);
        }
    }
    /**
     * Handle the Laboratory "created" event.
     */
    public function created(Laboratory $laboratory): void
    {
        //
    }

    /**
     * Handle the Laboratory "updated" event.
     */
    public function updated(Laboratory $laboratory): void
    {
        //
    }

    /**
     * Handle the Laboratory "deleted" event.
     */
    public function deleted(Laboratory $laboratory): void
    {
        //
    }

    /**
     * Handle the Laboratory "restored" event.
     */
    public function restored(Laboratory $laboratory): void
    {
        //
    }

    /**
     * Handle the Laboratory "force deleted" event.
     */
    public function forceDeleted(Laboratory $laboratory): void
    {
        //
    }
}
