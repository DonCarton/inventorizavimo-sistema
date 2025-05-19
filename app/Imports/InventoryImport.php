<?php

namespace App\Imports;

use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Laboratory;
use App\Rules\ExistsByNumericOrString;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Validators\Failure;

class InventoryImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError, SkipsOnFailure
{
    use SkipsErrors;
    private array $arrayOfAttributes = [];

    public array $caughtFailures = [];
    public array $caughtErrors = [];

    public function rules(): array
    {
        return [
            '*.local_name' => ['required','regex:/^[A-Z]{3,4}\d{3}-[A-Z]$/'],
            '*.inventory_type' => [
                'nullable',
                new ExistsByNumericOrString('item_types','inventory_type')
            ],
            '*.laboratory' => [
                'nullable',
                new ExistsByNumericOrString('laboratories','laboratory')
            ],
            '*.cupboard' => ['nullable','numeric','gte:0','lte:40'],
            '*.shelf' => ['nullable','string','regex:/[A-Z]/'],
            '*.total_amount' => ['nullable','numeric'],
            '*.critical_amount' => ['nullable','numeric'],
            '*.to_order' => ['nullable','numeric'],
            '*.average_consumption' => ['nullable','numeric'],
        ];
    }

    /**
     * @param array $row
     *
     * @return Model|InventoryItem|null
     */
    public function model(array $row): Model|InventoryItem|null
    {
        $inventoryType = (is_numeric($row['inventory_type'])) ? ItemType::find($row['inventory_type']) : ItemType::where('name', $row['inventory_type'])->first();
        $laboratory = (is_numeric($row['laboratory'])) ? Laboratory::find($row['laboratory']) : Laboratory::where('name', $row['laboratory'])->first();
        return InventoryItem::updateOrCreate(
            ['local_name' => $row['local_name']],
            [
                'inventory_type'   => $inventoryType?->id,
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
                'laboratory'       => $laboratory?->id,
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

    public function onFailure(Failure ...$failures): void
    {
        foreach ($failures as $failure) {
            $row = $failure->values();
            $isEmpty = collect($row)->every(fn ($value) => is_null($value) || trim($value) === '');
            $this->caughtFailures[] = [
                ucfirst(__('actions.imports.row')) => $failure->row(),
                ucfirst(__('actions.imports.field')) => $isEmpty ? '' : $failure->attribute(),
                ucfirst(__('actions.imports.value'))=> $failure->values()[$failure->attribute()],
                ucfirst(__('actions.imports.error_type')) => $isEmpty ? ucfirst(__('actions.imports.issue_types.empty')) : ucfirst(__('actions.imports.issue_types.validation')),
                ucfirst(__('actions.imports.error_message')) => $isEmpty ? '' : implode(' ', $failure->errors()),
            ];
        }
    }
}
