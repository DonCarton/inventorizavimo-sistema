<?php

namespace App\Observers;

use App\LogsPivotChanges;
use App\Models\Laboratory;

class LaboratoryObserver
{
    use LogsPivotChanges;

    public static function syncUserFacilities(Laboratory $laboratory)
    {
        foreach ($laboratory->users as $user)
        {
            $user->syncFacilitiesFromLaboratories();
        }
    }

    public static function syncFacilities(Laboratory $laboratory, array $facilityIds): void
    {
        $syncResult = $laboratory->facilities()->sync($facilityIds);
        self::logPivotSync($laboratory, 'facilities', $syncResult);
        self::syncUserFacilities($laboratory);
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
