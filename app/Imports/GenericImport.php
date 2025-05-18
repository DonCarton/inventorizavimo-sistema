<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\ImportRun;

class GenericImport implements ToCollection, WithHeadingRow
{
    protected ImportRun $importRun;
    protected int $createdBy;
    protected int $updatedBy;
    protected string $userLocale;
    protected array $errors = [];

    public array $caughtErrors = [];

    public function __construct(ImportRun $importRun, string $userLocale)
    {
        $this->importRun = $importRun;
        $this->createdBy = $importRun->created_by;
        $this->updatedBy = $importRun->updated_by;
        $this->userLocale = $userLocale;
    }

    public function collection(Collection $rows)
    {
        $definition = $this->importRun->definition;

        $mapping = $definition->field_mappings;
        $rules = $definition->validation_rules ?? [];

        $modelClass = $definition->model_class;
        
        $rules = \Config::get("steam_validations.$modelClass", []);
        $foreignKeyLookups = $definition->foreign_key_lookups ?? $modelClass::getImportForeignKeyLookups();

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;

            $input = [];
            foreach ($mapping as $csvKey => $modelAttr) {
                $input[$modelAttr] = $row[$csvKey] ?? null;
            }

            foreach ($foreignKeyLookups as $fkAttr => $lookupConfig) {
                if (!empty($input[$fkAttr])) {
                    $resolvedId = \DB::table($lookupConfig['table'])
                        ->where($lookupConfig['match_on'], $input[$fkAttr])
                        ->value('id');

                    if ($resolvedId) {
                        $input[$fkAttr] = $resolvedId;
                    } else {
                        $translationKey = 'validation.custom.' . $fkAttr . '.no_valid_record';
                        $this->errors[] = [
                            'row' => $rowNumber,
                            'errors' => [__($translationKey,['attribute' => __("validation.attributes.$fkAttr"), 'value' => $input[$fkAttr]])]
                        ];
                        //continue 2;
                    }
                }
            }


            $validator = Validator::make($input, $rules);

            if ($validator->fails()) {
                foreach ($validator->errors()->getMessages() as $field => $messages) {
                    foreach ($messages as $message) {
                        $this->caughtErrors[] = [
                            ucfirst(__('actions.imports.row'))         => $rowNumber,
                            ucfirst(__('actions.imports.field'))       => $field,
                            ucfirst(__('actions.imports.value'))       => $input[$field] ?? null,
                            ucfirst(__('actions.imports.error_type'))  => ucfirst(__('actions.imports.issue_types.validation')),
                            ucfirst(__('actions.imports.error_message')) => $message,
                        ];
                    }
                }

                
                $this->errors[] = [
                    'row' => $rowNumber,
                    'errors' => $validator->errors()->all()
                ];
                continue;
            }

            $uniqueBy = $modelClass::getImportUniqueBy();

            $uniqueValues = collect($uniqueBy)
                            ->mapWithKeys(fn($key) => [$key => $input[$key] ?? null])
                            ->toArray();

            $input['created_by'] = $this->createdBy->id;
            $input['updated_by'] = $this->updatedBy->id;

            $modelClass::updateOrCreate(
                $uniqueValues,
                $input
            );
        }

        if (!empty($this->errors)) {
            $this->importRun->update([
                'error_count' => count($this->errors),
                'status' => 'completed_with_errors',
            ]);
            if ($this->caughtErrors) {
                $failFileName = 'failed-imports-' . now()->timestamp . '.xlsx';
                \Maatwebsite\Excel\Facades\Excel::store(new \App\Exports\FailedExports($this->caughtErrors, $this->userLocale), "temp/{$failFileName}");
            }
            foreach ($this->errors as $field) {
                Log::error('Validation errors', $field);
            }
        }
    }
}