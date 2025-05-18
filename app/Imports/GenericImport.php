<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Validator;
use App\Models\ImportRun;
use App\Models\User;
use App\Mail\ImportReportMail;
class GenericImport implements ToCollection, WithHeadingRow
{
    protected ImportRun $importRun;
    protected User $user;
    protected int $createdBy;
    protected int $updatedBy;
    protected string $userLocale;
    protected array $errors = [];

    public array $caughtErrors = [];

    public function __construct(ImportRun $importRun, string $userLocale, User $user)
    {
        $this->importRun = $importRun;
        $this->createdBy = $importRun->created_by;
        $this->updatedBy = $importRun->updated_by;
        $this->userLocale = $userLocale;
        $this->user = $user;
    }

    public function collection(Collection $rows)
    {
        $totalRowCount = $rows->count();
        $definition = $this->importRun->definition;

        $mapping = $definition->field_mappings;

        $normalizedMapping = collect($mapping)->mapWithKeys(function ($modelAttr, $csvKey) {
                $normalizedKey = Str::slug($csvKey, '_');
                return [$normalizedKey => $modelAttr];
            })->toArray();

        $rules = $definition->validation_rules ?? [];

        $modelClass = $definition->model_class;
        
        $rules = \Config::get("steam_validations.$modelClass", []);
        $foreignKeyLookups = $definition->foreign_key_lookups ?? $modelClass::getImportForeignKeyLookups();

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;
            
            $input = [];
            foreach ($normalizedMapping as $csvKey => $modelAttr) {
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
                            'errors' => [__($translationKey,['attribute' => __("validation.attributes.$fkAttr"), 'value' => $input[$fkAttr]],$this->userLocale)]
                        ];
                    }
                }
            }


            $validator = Validator::make($input, $rules);

            if ($validator->fails()) {
                foreach ($validator->errors()->getMessages() as $field => $messages) {
                    foreach ($messages as $message) {
                        $this->caughtErrors[] = [
                            ucfirst(__('actions.imports.row',[],$this->userLocale))         => $rowNumber,
                            ucfirst(__('actions.imports.field',[],$this->userLocale))       => ucfirst(__('validation.attributes.' . $field)),
                            ucfirst(__('actions.imports.value',[],$this->userLocale))       => $input[$field] ?? null,
                            ucfirst(__('actions.imports.error_type',[],$this->userLocale))  => ucfirst(__('actions.imports.issue_types.validation',[],$this->userLocale)),
                            ucfirst(__('actions.imports.error_message',[],$this->userLocale)) => $message,
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

            $input['created_by'] = $this->createdBy;
            $input['updated_by'] = $this->updatedBy;

            $modelClass::updateOrCreate($uniqueValues,$input);
        }

        if (!empty($this->errors)) {
            $failFileName = 'failed-imports-' . now()->timestamp . '.xlsx';
            $failedImportPath = "imports/failed/{$failFileName}";
            \Maatwebsite\Excel\Facades\Excel::store(new \App\Exports\FailedExports($this->caughtErrors, $this->userLocale), $failedImportPath);
            $this->importRun->update([
                'row_count' => $totalRowCount,
                'error_count' => count($this->errors),
                'status' => 'completed_with_errors',
                'output_file_path' => $failedImportPath,
            ]);
            $mailFilePath = storage_path('app/' . $failedImportPath);
            \Mail::to($this->user)->send(new ImportReportMail(__('mail.imports.failure'), $mailFilePath, $this->user, true));
        } else {
            $this->importRun->update([
                'row_count' => $totalRowCount,
                'error_count' => 0,
                'status' => 'completed',
                'output_file_path' => null,
            ]);
            \Mail::to($this->user)->send(new ImportReportMail(__('mail.imports.success'), "", $this->user));
        }
    }
}