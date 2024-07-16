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
    private string $data;
    public function __construct(string $data)
    {
        $this->data = $data;
    }
    /**
    * @return Collection
    */
    public function collection(): Collection
    {
        return InventoryItem::query()->where('local_name','like','%'.$this->data.'%')->get();
        //return InventoryItem::all();
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
