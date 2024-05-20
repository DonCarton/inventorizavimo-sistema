<?php

namespace App\Exports;

use App\Models\Laboratory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class UserExports implements FromQuery, WithMapping, WithHeadings
{
    /**
    * @return Builder
     */
    public function query(): Builder
    {
        return User::query();
    }

    /**
     * @param $row
     * @return array
     */
    public function map($row): array
    {
        $laboratory = Laboratory::query()->get()->where('id','=',$row->laboratory)->last()->toArray();
        return [
            $row->id,
            $row->first_name,
            $row->last_name,
            $row->email,
            $laboratory['name'],
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
            'FirstName',
            'LastName',
            'Email',
            'Laboratory',
            'CreateTime'
        ];
    }
}
