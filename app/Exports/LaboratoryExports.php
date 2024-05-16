<?php

namespace App\Exports;

use App\Models\Laboratory;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class LaboratoryExports implements FromQuery, WithMapping, WithHeadings
{
    /**
     * @return Builder
     */
    public function query(): Builder
    {
        return Laboratory::query();
    }
    public function map($row): array
    {
        return [
            $row->id,
            $row->name,
            (new Carbon($row->created_at))->format('Y-m-d H:m'),
            (new Carbon($row->updated_at))->format('Y-m-d H:m')
        ];
    }
    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'CreateTime',
            'UpdateTime'
        ];
    }

}
