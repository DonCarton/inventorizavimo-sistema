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
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Maatwebsite\Excel\Events\AfterSheet;

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
            $row->formula,
            $row->cas_nr,
            $row->provider,
            $row->barcode,
            $row->url_to_provider,
            $row->alt_url_to_provider,
            $row->total_amount,
            $row->critical_amount,
            $row->to_order_amount,
            (bool)$row->multiple_locations,
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
            'Formulė',
            'CAS nr',
            'Tiekėjas',
            'Barkodas',
            'Tiekėjo nuoroda',
            'Alternatyvi tiekėjo nuoroda',
            'Kiekis',
            'Kritinis kiekis',
            'Užsakyti',
            'Keliose vietose',
            'VU turto numeris',
            'Paskirtis',
            'Komentarai',
            'Sukurta',
            'Paskutinį kartą pakeistas',
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
