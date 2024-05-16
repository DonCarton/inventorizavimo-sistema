<?php

namespace App\Imports;

use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithUpserts;

class InventoryImport implements ToModel, WithUpserts, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return Model|null
    */
    public function model(array $row)
    {
        return new InventoryItem([
            'local_name' => $row['local_name'],
            'name' => $row['name'],
            'name_eng' => $row['name_eng'],
            'barcode' => $row['barcode'],
            'laboratory' => $row['laboratory'],
            'total_count' => $row['total_count'],
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id,
        ]);
    }
    /**
     * @return string
     */
    public function uniqueBy(): string
    {
        return 'local_name';
    }
}
