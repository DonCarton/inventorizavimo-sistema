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
    private array $arrayOfAttributes = [];

    /**
     * @param array $row
     *
     * @return Model|InventoryItem|null
     */
    public function model(array $row): Model|InventoryItem|null
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
            'total_amount'         => $row['total_count'],
            'critical_amount'     => $row['critical_amount'],
            'to_order_amount'            => $row['to_order'],
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
//        $inventoryType = ItemType::where('name', $row['tipas'])->first();
//        $laboratory = Laboratory::where('name', $row['patalpa'])->first();
//        return new InventoryItem([
//            'local_name'          => $row['kodas'],
//            'inventory_type'   => $inventoryType ? $inventoryType->id : null,
//            'name'                => $row['pavadinimas'],
//            'name_eng'            => $row['pavadinimas_eng'],
//            'formula'             => $row['formule'],
//            'cas_nr'              => $row['cas_nr'],
//            'user_guide'          => $row['sdl_naudojimo_instrukcijos'],
//            'provider'            => $row['tiekejas'],
//            'product_code'        => $row['prekes_kodas_kataloginis_numeris'],
//            'barcode'             => $row['prekes_barkodo_numeris'],
//            'url_to_provider'     => $row['nuoroda'],
//            'alt_url_to_provider' => $row['alternatyvi_preke_tiekejas'],
//            'total_count'         => $row['kiekis'],
//            'critical_amount'     => $row['kritinis_kiekis'],
//            'to_order'            => $row['kiek_reikia_uzsakyti'],
//            'average_consumption' => $row['apytikris_sunaudojamumas_menesiui'],
//            'multiple_locations'  => $row['ar_priemone_yra_keliose_lokacijose'],
//            'laboratory'          => $laboratory ? $laboratory->id : null,
//            'cupboard'            => $row['spinta'],
//            'shelf'               => $row['lentyna'],
//            'storage_conditions'  => $row['laikymo_salygos'],
//            'asset_number'        => $row['inventorizacinis_nr_tik_ilgalaikiam_turtui'],
//            'used_for'            => $row['laboratoriniai_darbai_kuriems_naudojamas'],
//            'comments'            => $row['komentarai'],
//            'created_by' => auth()->user()->id,
//            'updated_by' => auth()->user()->id,
//        ]);
    }
    /**
     * @return string
     */
    public function uniqueBy(): string
    {
        return 'local_name';
    }
}
