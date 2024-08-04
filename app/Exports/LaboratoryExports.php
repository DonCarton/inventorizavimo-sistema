<?php

namespace App\Exports;

use App\Models\Laboratory;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LaboratoryExports implements FromCollection, WithMapping, WithHeadings, WithStyles, WithEvents, ShouldAutoSize
{
    private array $data;
    public function __construct(array $data = [])
    {
        $this->data = array_diff_key($data, array_flip(['sort_direction', 'sort_field']));
    }

    public function collection(): Collection
    {
        $query = Laboratory::query();
        if (!empty($this->data)) {
            if (isset($this->data['name'])) {
                $query->where('name', 'like', '%' . $this->data['name'] . '%');
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
            $row->name,
            (new Carbon($row->created_at))->format('Y-m-d H:m:s'),
            (new Carbon($row->updated_at))->format('Y-m-d H:m:s')
        ];
    }

    /**
     * @return string[]
     */
    public function headings(): array
    {
        return [
            'Pavadinimas',
            'Sukurta',
            'Paskutinį kartą atnaujinta'
        ];
    }
    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true],
                'borders' => [
                    'outline' => [
                        'borderStyle' => Border::BORDER_MEDIUM,
                    ],
                ],
            ],
        ];
    }

    /**
     * @return array
     */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();

                $sheet->getStyle("A1:{$highestColumn}{$highestRow}")
                    ->getBorders()
                    ->getAllBorders()
                    ->setBorderStyle(Border::BORDER_THIN);

                $sheet->getStyle("A1:{$highestColumn}1")
                    ->getBorders()
                    ->getAllBorders()
                    ->setBorderStyle(Border::BORDER_MEDIUM);
            },
        ];
    }

}
