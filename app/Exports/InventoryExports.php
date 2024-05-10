<?php

namespace App\Exports;

use App\Models\InventoryItem;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;

class InventoryExports implements FromCollection
{
    /**
    * @return Collection
    */
    public function collection(): Collection
    {
        return InventoryItem::all();
    }
}
