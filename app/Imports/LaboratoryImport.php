<?php

namespace App\Imports;

use App\Models\Laboratory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithUpserts;
use Throwable;

class LaboratoryImport implements ToModel, WithUpserts, WithHeadingRow, SkipsEmptyRows, SkipsOnError
{
    use SkipsErrors;
    /**
    * @param array $row
    *
    * @return Model|null
    */
    public function model(array $row)
    {
        return new Laboratory([
            'name' => $row['name'],
            'ident_code' => $row['ident_code'],
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id,
        ]);
    }
    /**
     * @return string
     */
    public function uniqueBy(): string
    {
        return 'name';
    }
    public function onError(Throwable $e): void
    {
        Log::error('Import error: ' . $e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ]);
    }
}
