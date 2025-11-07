<?php

namespace App\Exports;

use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Laboratory;
use DateTimeZone;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
//use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Maatwebsite\Excel\Events\AfterSheet;

/**
 * TODO: IMPROVE IT SO THAT IT ALSO STAMPS THE LOGO IN THE UPPER LEFT CORNER OF THE DOCUMENT.
 */

class InventoryExports implements FromCollection, WithMapping, WithHeadings, WithStyles, WithEvents, ShouldAutoSize
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
                $query->where('inventory_type', '=', $this->data['inventory_type']);
            }
            if (isset($this->data['laboratory'])) {
                $query->whereHas('belongsToLaboratory', function ($query) {
                    if (gettype($this->data['laboratory']) === "integer"){
                        $query->where('id', '=', $this->data['laboratory']);
                    } else {
                        $query->where('name', 'like', '%' . $this->data['laboratory'] . '%');
                    }
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

    /*public function startCell(): string
    {
        return 'C1';
    }*/

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
            $row->inventory_type ? ItemType::where('id', $row->inventory_type)->first()->name : '-',
            $row->laboratory ? Laboratory::where('id', $row->laboratory)->first()->name : '-',
            $row->facilities->pluck('name')->implode('|'),
            $row->cupboard,
            $row->shelf,
            $row->formula,
            $row->cas_nr,
            $row->user_guide,
            $row->provider,
            $row->product_code,
            $row->barcode,
            $row->url_to_provider,
            $row->alt_url_to_provider,
            $row->total_amount,
            $row->critical_amount,
            $row->to_order_amount,
            $row->average_consumption,
            (bool)$row->multiple_locations,
            $row->storage_conditions,
            $row->asset_number,
            $row->used_for,
            $row->comments,
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
            'Kodas',
            'Pavadinimas',
            'Pavadinimas ENG',
            'Tipas',
            'Laboratorija',
            'Patalpa',
            'Spinta',
            'Lentyna',
            'Formulė',
            'CAS nr',
            'SDL/Naudojimo instrukcijos',
            'Tiekėjas',
            'Produkto kodas',
            'Barkodas',
            'Tiekėjo nuoroda',
            'Alternatyvi tiekėjo nuoroda',
            'Kiekis',
            'Kritinis kiekis',
            'Užsakyti',
            'Vidutinis sunaudojimas',
            'Keliose vietose',
            'Laikymo sąlygos',
            'VU turto numeris',
            'Paskirtis',
            'Komentarai',
            'Sukurta',
            'Paskutinį kartą pakeistas',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // $sheet->getRowDimension(1)->setRowHeight(110);
        // $sheet->mergeCells("A1:B1");
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

                /*$drawing = new Drawing();
                $drawing->setName('SteamLT_LOGO');
                $drawing->setDescription('SteamLT logotipas');
                $drawing->setPath(public_path('/img/path_to_image.jpg'));
                $drawing->setHeight(110);
                $drawing->setCoordinates('A1');
                $drawing->setWorksheet($sheet);*/

                $sheet->getStyle("A2:{$highestColumn}{$highestRow}")
                    ->getBorders()
                    ->getAllBorders()
                    ->setBorderStyle(Border::BORDER_THIN);

                $sheet->getStyle("C1:{$highestColumn}1")
                    ->getBorders()
                    ->getAllBorders()
                    ->setBorderStyle(Border::BORDER_MEDIUM);

                $sheet->getStyle("C1:{$highestColumn}1")
                    ->getAlignment()
                    ->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER)
                    ->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                    
                // for ($row = 2; $row <= $highestRow; $row++) {
                //     $sheet->mergeCells("A{$row}:B{$row}");
                // }
                
                // $sheet->setCellValue("A1","");
            },
        ];
    }
}
