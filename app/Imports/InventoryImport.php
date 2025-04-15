<?php

namespace App\Imports;

use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Laboratory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Throwable;

class InventoryImport implements ToModel, WithHeadingRow, WithValidation, SkipsEmptyRows, SkipsOnError, SkipsOnFailure
{
    use SkipsErrors;
    private array $arrayOfAttributes = [];

    public array $caughtFailures = [];

    public function rules(): array
    {
        return [
            '*.local_name' => ['required','regex:/^[A-Z]{3,4}\d{3}-[A-Z]$/'],
            '*.cupboard' => ['nullable','string','regex:/[A-Z]/'],
            '*.shelf' => ['nullable','numeric','gte:0','lte:40'],
        ];
    }

    /**
     * @param array $row
     *
     * @return Model|InventoryItem|null
     */
    public function model(array $row): Model|InventoryItem|null
    {
        $inventoryType = ItemType::where('name', $row['inventory_type'])->first();
        $laboratory = Laboratory::where('name', $row['laboratory'])->first();
        return InventoryItem::updateOrCreate(
            ['local_name' => $row['local_name']],
            [
                'inventory_type'   => $inventoryType ? $inventoryType->id : null,
                'name'             => $row['name'],
                'name_eng'         => $row['name_eng'],
                'formula'          => $row['formula'],
                'cas_nr'           => $row['cas_nr'],
                'user_guide'       => $row['user_guide'],
                'provider'         => $row['provider'],
                'product_code'     => $row['product_code'],
                'barcode'          => $row['barcode'],
                'url_to_provider'  => $row['url_to_provider'],
                'alt_url_to_provider' => $row['alt_url_to_provider'],
                'total_amount'      => $row['total_count'],
                'critical_amount'  => $row['critical_amount'],
                'to_order_amount'  => $row['to_order'],
                'average_consumption' => $row['average_consumption'],
                'multiple_locations' => $row['multiple_locations'],
                'laboratory'       => $laboratory ? $laboratory->id : null,
                'cupboard'         => $row['cupboard'],
                'shelf'            => $row['shelf'],
                'storage_conditions' => $row['storage_conditions'],
                'asset_number'     => $row['asset_number'],
                'used_for'         => $row['used_for'],
                'comments'         => $row['comments'],
                'created_by'       => auth()->user()->id,
                'updated_by'       => auth()->user()->id,
            ]
        );
    }

    public function onError(Throwable $e): void
    {
        Log::error('Import error: ' . $e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ]);
    }

    public function onFailure(\Maatwebsite\Excel\Validators\Failure ...$failures)
    {
        foreach($failures as $failure)
        {
            $this->caughtFailures[] = [
                'row' => $failure->row(),
                'local_name' => $failure->values()['local_name'] ?? null,
                'cupboard' => $failure->values()['cupboard'] ?? null,
                'shelf' => $failure->values()['shelf'] ?? null,
                'error_type'   => 'Validation',
                'error_message'=> implode(' ', $failure->errors()),
            ];
        }
    }
}
