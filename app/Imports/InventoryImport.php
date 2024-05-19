<?php

namespace App\Imports;

use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Laboratory;
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
        $inventoryType = ItemType::where('name', $row['inventory_type'])->first();
        $laboratory = Laboratory::where('name', $row['laboratory'])->first();
        return new InventoryItem([
            'local_name'          => $row['local_name'],
            'inventory_type'   => $inventoryType ? $inventoryType->id : null,
            'name'                => $row['name'],
            'name_eng'            => $row['name_eng'],
            'formula'             => $row['formula'],
            'cas_nr'              => $row['cas_nr'],
            'user_guide'          => $row['user_guide'],
            'provider'            => $row['provider'],
            'product_code'        => $row['product_code'],
            'barcode'             => $row['barcode'],
            'url_to_provider'     => $row['url_to_provider'],
            'alt_url_to_provider' => $row['alt_url_to_provider'],
            'total_count'         => $row['total_count'],
            'critical_amount'     => $row['critical_amount'],
            'to_order'            => $row['to_order'],
            'average_consumption' => $row['average_consumption'],
            'multiple_locations'  => $row['multiple_locations'],
            'laboratory'          => $laboratory ? $laboratory->id : null,
            'cupboard'            => $row['cupboard'],
            'shelf'               => $row['shelf'],
            'storage_conditions'  => $row['storage_conditions'],
            'asset_number'        => $row['asset_number'],
            'used_for'            => $row['used_for'],
            'comments'            => $row['comments'],
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
