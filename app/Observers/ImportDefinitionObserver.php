<?php

namespace App\Observers;

use App\Models\ImportDefinition;
use App\Models\ImportRunRecord;

class ImportDefinitionObserver
{
    public function deleting(ImportDefinition $importDefinition)
    {
        $importRunIds = $importDefinition->runs()->pluck('id');

        $createdRecords = ImportRunRecord::whereIn('import_run_id', $importRunIds)
            ->where('action', 'created')
            ->get()
            ->groupBy('recordable_type');

        foreach ($createdRecords as $modelClass => $records) {
            $modelClass::whereIn('id', $records->pluck('recordable_id'))->delete();
        }
    }
}
