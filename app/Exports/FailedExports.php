<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Exception;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class FailedExports implements FromCollection, WithHeadings, ShouldAutoSize, WithStyles
{
    protected Collection $rows;

    public function __construct(array $rows)
    {
        $this->rows = collect($rows);
    }

    public function collection(): Collection
    {
        return $this->rows;
    }

    public function headings(): array
    {
        return [
            ucfirst(__('actions.imports.row')),
            ucfirst(__('actions.imports.value')),
            ucfirst(__('actions.imports.field')),
            ucfirst(__('actions.imports.error_type')),
            ucfirst(__('actions.imports.error_message'))
        ];
    }

    /**
     * @throws Exception
     */
    public function styles(Worksheet $sheet): array
    {
        $sheet->getStyle('A1:E1')->getFont()->setBold(true);

        $lastRow = $this->rows->count() + 1;

        $sheet->getStyle("E2:E{$lastRow}")->getFont()->getColor()->setRGB('FF0000');

        $sheet->getStyle("A1:E{$lastRow}")->applyFromArray([
            'borders' => [
                'outline' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THICK],
                'inline' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN],
            ],
        ]);

        return [];
    }
}
