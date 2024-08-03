<?php

namespace App\Exports;

use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Laboratory;
use App\Models\User;
use DateTimeZone;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Maatwebsite\Excel\Events\AfterSheet;

// TODO: For some reason the user export just doesn't want to work after some changes, to be investigated

class UserExports implements FromCollection, WithMapping, WithHeadings, WithStyles, WithEvents, ShouldAutoSize
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
        $query = User::query();
        if (!empty($this->data)) {
            if (isset($this->data['email'])) {
                $query->where('email', 'like', '%' . $this->data['email'] . '%');
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
            $row->first_name,
            $row->last_name,
            $row->email,
            $row->laboratory ? Laboratory::where('id', $row->laboratory) : '-',
        ];
    }

    /**
     * @return string[]
     */
    public function headings(): array
    {
        return [
            'Vardas',
            'Pavardė',
            'Paštas',
            'Laboratorija',
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
