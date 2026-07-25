<?php

namespace App\Exports;

use App\Exports\Concerns\WithBrandedHeader;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;

abstract class BrandedExport implements WithHeadings, WithStyles, WithEvents, ShouldAutoSize, WithCustomStartCell
{
    use WithBrandedHeader;
}
