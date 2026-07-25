<?php

namespace App\Exports\Concerns;

use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

trait WithBrandedHeader
{
    abstract public function exportTitle(): string;

    public function startCell(): string
    {
        return 'A3';
    }

    public function styles(Worksheet $sheet)
    {
        return array_replace_recursive([
            3 => [
                'font' => ['bold' => true],
                'borders' => [
                    'outline' => ['borderStyle' => Border::BORDER_MEDIUM],
                ],
            ],
        ], $this->additionalStyles($sheet));
    }

    protected function additionalStyles(Worksheet $sheet): array
    {
        return [];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();

                $sheet->getRowDimension(1)->setRowHeight(100);
                $sheet->mergeCells("A1:{$highestColumn}1");

                $logoPath = config('branding.logo_path_colour');
                $logoAbsolutePath = public_path($logoPath);
                if ($logoPath && file_exists($logoAbsolutePath)) {
                    $dimensions = @getimagesize($logoAbsolutePath);

                    if ($dimensions !== false) {
                            [$naturalWidth, $naturalHeight] = $dimensions;

                            $maxWidth = 220;
                            $maxHeight = 85;

                            $widthRatio = $maxWidth / $naturalWidth;
                            $heightRatio = $maxHeight / $naturalHeight;

                            $drawing = new Drawing();
                            $drawing->setName('Logo');
                            $drawing->setDescription('Application logo');
                            $drawing->setPath($logoAbsolutePath);
                            $drawing->setResizeProportional(true);

                            if ($widthRatio < $heightRatio) {
                                $drawing->setWidth((int) round($naturalWidth * $widthRatio));
                            } else {
                                $drawing->setHeight((int) round($naturalHeight * $heightRatio));
                            }

                            $drawing->setCoordinates('A1');
                            $drawing->setOffsetX(5);
                            $drawing->setOffsetY(5);
                            $drawing->setWorksheet($sheet);
                    }
                }

                $sheet->mergeCells("A2:{$highestColumn}2");
                $sheet->setCellValue('A2', config('app.name') . ' — ' . $this->exportTitle());
                $sheet->getStyle('A2')->getFont()->setBold(true)->setSize(16);
                $sheet->getStyle("A2:{$highestColumn}2")
                    ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

                $sheet->getStyle("A3:{$highestColumn}3")
                    ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_MEDIUM);
                $sheet->getStyle("A3:{$highestColumn}3")
                    ->getAlignment()
                    ->setVertical(Alignment::VERTICAL_CENTER)
                    ->setHorizontal(Alignment::HORIZONTAL_CENTER);

                $sheet->getStyle("A4:{$highestColumn}{$highestRow}")
                    ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

                $this->afterSheetHook($sheet, $event);
            },
        ];
    }

    protected function afterSheetHook(Worksheet $sheet, AfterSheet $event): void
    {
    }
}
