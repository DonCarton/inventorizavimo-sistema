<?php

namespace App\Exports;

use App\Models\InventoryItem;
use DateTimeZone;
use Illuminate\Support\Collection;
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
            if (isset($this->data['local_name'])) {
                $query->where('local_name', 'like', '%' . $this->data['local_name'] . '%');
            }
            if (isset($this->data['name'])) {
                $query->where('name', 'like', '%' . $this->data['name'] . '%');
            }
            if (isset($this->data['name_eng'])) {
                $query->where('name_eng', 'like', '%' . $this->data['name_eng'] . '%');
            }
            if (isset($this->data['inventory_type'])) {
                $query->whereHas('itemType', function ($query) {
                    $query->where('name', 'like', '%' . $this->data['inventory_type'] . '%');
                });
            }
            if (isset($this->data['laboratory'])) {
                $query->whereHas('belongsToLaboratory', function ($query) {
                    $query->where('name', 'like', '%' . $this->data['laboratory'] . '%');
                });
            }
            if (isset($this->data['updated_by'])) {
                $query->whereHas('updatedBy', function ($query) {
                    $query->where('email', 'like', '%' . $this->data['updated_by'] . '%');
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
            $row->local_name,
            $row->name,
            $row->name_eng,
//            (new Carbon($row->created_at))->format('Y-m-d H:m'),
//            (new Carbon($row->updated_at))->format('Y-m-d H:m'),
            $row->created_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i:s'),
            $row->updated_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i:s')
        ];
    }

    /**
     * @return string[]
     */
    public function headings(): array
    {
        return [
            'Code',
            'Name',
            'NameENG',
            'CreateTime',
            'UpdateTime',
        ];
    }
}
