<?php

namespace App\Exports;

use App\Models\InventoryItem;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class InventoryExports implements FromCollection, WithMapping, WithHeadings
{
    private array $data;
    public function __construct(array $data = [])
    {
        $this->data = $data;
    }
    /**
    * @return Collection
    */
    public function collection(): Collection
    {
        $query = InventoryItem::query();
        if ($this->data != []){
            foreach ($this->data as $column => $value) {
                $query->where($column, 'like', "%{$value}%");
            }
            return $query->get();
        }
        return InventoryItem::all();
//        return InventoryItem::query()->where('local_name','like','%'.$this->data.'%')->get();
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
