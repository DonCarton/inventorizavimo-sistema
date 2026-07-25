<?php

namespace App\Exports;

use App\Exports\BrandedExport;
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
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Maatwebsite\Excel\Events\AfterSheet;

/**
 * TODO: IMPROVE IT SO THAT IT ALSO STAMPS THE LOGO IN THE UPPER LEFT CORNER OF THE DOCUMENT.
 */

class InventoryExports extends BrandedExport implements FromCollection, WithMapping
{
    private array $data;
    private string $sortDirection = 'asc';
    private string $sortField = 'local_name';

    private const SORTABLE_FIELDS = [
        'local_name', 'name', 'name_eng', 'inventory_type',
        'laboratory', 'updated_by'
    ];

    public function exportTitle(): string
    {
        return "Inventoriaus įrašai";
    }

    public function __construct(array $data = [])
    {
        //$this->sortField = in_array($data['sort_field'] ?? null, self::SORTABLE_FIELDS, true) ? $data['sort_field'] : 'local_name';
        //$this->sortDirection = strtolower($data['sort_direction'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
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
                if (is_array($this->data['laboratory'])) {
                    $query->whereIn('laboratory', $this->data['laboratory']);
                } else {
                    $query->whereHas('belongsToLaboratory', function ($query) {
                        if (gettype($this->data['laboratory']) === "integer"){
                            $query->where('id', '=', $this->data['laboratory']);
                        } else {
                            $query->where('name', 'like', '%' . $this->data['laboratory'] . '%');
                        }
                    });
                }
            }
            if (isset($this->data['updated_by'])) {
                $query->whereHas('updatedBy', function ($query) {
                    $query->where('email', 'like', '%' . $this->data['updated_by'] . '%');
                });
            }
        }
        return $query->orderBy($this->sortField,$this->sortDirection)->get();
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

    /*public function startCell(): string
    {
        return 'A2';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            2 => [
                'font' => ['bold' => true],
                'borders' => [
                    'outline' => [
                        'borderStyle' => Border::BORDER_MEDIUM,
                    ],
                ],
            ],
        ];
    }*/

    /**
     * @return array
     */
    /*public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();

                $sheet->getRowDimension(1)->setRowHeight(60);
                $sheet->mergeCells("A1:{$highestColumn}1"); // full-width band for the logo

                $logoPath = config('branding.logo_path');
                if ($logoPath && file_exists(public_path($logoPath))) {
                    $drawing = new Drawing();
                    $drawing->setName('Logo');
                    $drawing->setDescription('Application logo');
                    $drawing->setPath(public_path($logoPath));
                    $drawing->setResizeProportional(true);
                    $drawing->setHeight(50);
                    $drawing->setCoordinates('A1');
                    $drawing->setOffsetX(5);
                    $drawing->setOffsetY(5);
                    $drawing->setWorksheet($sheet);
                }

                $sheet->getStyle("A3:{$highestColumn}{$highestRow}")
                     ->getBorders()
                     ->getAllBorders()
                     ->setBorderStyle(Border::BORDER_THIN);

                $sheet->getStyle("A2:{$highestColumn}2")
                     ->getBorders()
                     ->getAllBorders()
                     ->setBorderStyle(Border::BORDER_MEDIUM);

                $sheet->getStyle("A2:{$highestColumn}2")
                     ->getAlignment()
                     ->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER)
                     ->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            },
        ];
    }*/
}
