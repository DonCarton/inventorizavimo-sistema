<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;

/**
 * Used with Excel::toArray() for the header/sample-row preview, so formula
 * cells (e.g. =FALSE()) show their result, the same as the import reads them.
 */
class PreviewImport implements WithCalculatedFormulas
{
}
