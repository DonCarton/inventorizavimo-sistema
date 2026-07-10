<?php

namespace App\Observers;

use App\LogsPivotChanges;
use App\Models\Facility;

class FacilityObserver
{
    use LogsPivotChanges;

    public static function syncLaboratories(Facility $facility, int|array $laboratoryId): void
    {
        $syncResult = $facility->laboratories()->sync($laboratoryId);
        self::logPivotSync($facility, 'laboratories', $syncResult);
    }
}
