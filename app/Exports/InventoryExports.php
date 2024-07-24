<?php

namespace App\Exports;

use App\Models\InventoryItem;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class InventoryExports implements FromCollection, WithMapping, WithHeadings
{
    private array $data;

    public function __construct(array $data = [])
    {
        $this->data = array_diff_key($data, array_flip(['sort_direction', 'sort_field']));
    }

    /**
     * @return Collection
     */
    public function collection(): Collection
    {
        $query = InventoryItem::query();
        if (!empty($this->data)) {
            foreach ($this->data as $column => $value) {
                if ($column !== 'inventory_type') {
                    $query->where($column, 'LIKE', "%{$value}%");
                }
            }
            if (isset($this->data['inventory_type'])) {
                $query->whereHas('itemType', function ($query) {
                    $query->where('name', 'like', '%' . $this->data['inventory_type'] . '%');
                });
            }
            if (isset($this->data['laboratory'])) {
                $query->whereHas('manyLaboratories', function ($query) {
                    $query->where('name', 'like', '%' . $this->data['laboratory'] . '%');
                });
            }
        }
        return $query->get();
    }

    /**
     * @param $row
     * @return array
     */
    public function map($row): array
    {
        return [
            $row->id,
            $row->local_name,
            $row->name,
            $row->name_eng,
            (new Carbon($row->created_at))->format('Y-m-d H:m'),
            (new Carbon($row->updated_at))->format('Y-m-d H:m')
        ];
    }

    /**
     * @return string[]
     */
    public function headings(): array
    {
        return [
            'ID',
            'Code',
            'Name',
            'NameENG',
            'CreateTime',
            'UpdateTime',
        ];
    }
}
