<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

/**
 * Runs the real import logic against a file inside a transaction that is
 * always rolled back, so nothing is persisted. No emails, no run records.
 */
class DryRunImport implements ToCollection, WithHeadingRow, WithCalculatedFormulas
{
    public int $totalRows = 0;

    public array $errors = [];

    public function __construct(protected ImportRowProcessor $processor)
    {
    }

    public function collection(Collection $rows)
    {
        $this->totalRows = $rows->count();

        DB::beginTransaction();

        try {
            $this->errors = $this->processor->process($rows);
        } finally {
            DB::rollBack();
        }
    }
}
