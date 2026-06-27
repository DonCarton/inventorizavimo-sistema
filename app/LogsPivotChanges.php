<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

trait LogsPivotChanges
{
    public static function logPivotSync(Model $subject, string $relationLabel, array $syncResult): void
    {
        $attached = array_values($syncResult['attached'] ?? []);
        $detached = array_values($syncResult['detached'] ?? []);

        if (empty($attached) && empty($detached)) {
            return;
        }

        activity()
            ->performedOn($subject)
            ->event('updated')
            ->withProperties(['relation' => $relationLabel, 'added' => $attached, 'removed' => $detached])
            ->log("{$relationLabel} updated");
    }
}
