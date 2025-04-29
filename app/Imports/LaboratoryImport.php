<?php

namespace App\Imports;

use App\Models\Laboratory;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithUpserts;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Validators\Failure;

class LaboratoryImport implements ToModel, WithUpserts, WithHeadingRow, WithValidation, SkipsOnFailure, SkipsEmptyRows, SkipsOnError
{
    use SkipsErrors;

    public array $caughtFailures = [];

    public function rules(): array
    {
        return [
            '*.name' => ['required','string'],
            '*.ident_code' => ['nullable','string'],
        ];
    }

    /**
    * @param array $row
    *
    * @return Model|null
    */
    public function model(array $row)
    {
        return new Laboratory([
            'name' => $row['name'],
            'ident_code' => $row['ident_code'],
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id,
        ]);
    }
    /**
     * @return string
     */
    public function uniqueBy(): string
    {
        return 'name';
    }

    public function onFailure(Failure ...$failures): void
    {
        foreach ($failures as $failure) {
            $row = $failure->values();
            $isEmpty = collect($row)->every(fn ($value) => is_null($value) || trim($value) === '');
            $this->caughtFailures[] = [
                ucfirst(__('actions.imports.row')) => $failure->row(),
                ucfirst(__('actions.imports.field')) => $isEmpty ? '' : $failure->attribute(),
                ucfirst(__('actions.imports.value'))=> $failure->values()[$failure->attribute()],
                ucfirst(__('actions.imports.error_type')) => $isEmpty ? ucfirst(__('actions.imports.issue_types.empty')) : ucfirst(__('actions.imports.issue_types.validation')),
                ucfirst(__('actions.imports.error_message')) => $isEmpty ? '' : implode(' ', $failure->errors()),
            ];
        }
    }
}
