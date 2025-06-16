<?php

namespace App\Imports;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
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

    protected int $totalRowCount;

    protected string $userLocale;

    protected string $validationFileName = "steam_validations";

    protected array $errors = [];

    public array $caughtErrors = [];

    /**
     * Summary of __construct
     * @param \App\Models\ImportRun $importRun
     * @param string $userLocale
     * @param \App\Models\User $user
     */
    public function __construct(ImportRun $importRun, string $userLocale, User $user)
    {
        $this->importRun = $importRun;
        $this->createdBy = $importRun->created_by;
        $this->updatedBy = $importRun->updated_by;
        $this->userLocale = $userLocale;
        $this->user = $user;
    }

    /**
     * Summary of collection
     * @param \Illuminate\Support\Collection $rows
     * @return void
     */
    public function collection(Collection $rows)
    {
        $this->totalRowCount = $rows->count();
        $definition = $this->importRun->definition;

        $mapping = $definition->field_mappings;

        $normalizedMapping = collect($mapping)->mapWithKeys(function ($modelAttr, $csvKey) {
            $normalizedKey = Str::slug($csvKey, '_');
            return [$normalizedKey => $modelAttr];
        })->toArray();

        $rules = $definition->validation_rules ?? [];

        $modelClass = $definition->model_class;

        $fullValidationPath = "{$this->validationFileName}.{$modelClass}";

        $rules = Config::get($fullValidationPath, []);

        $foreignKeyLookups = $definition->foreign_key_lookups ?? $modelClass::getImportForeignKeyLookups();

        foreach ($rows as $index => $row) {

            $rowNumber = $index + 2;

            $input = [];
            foreach ($normalizedMapping as $csvKey => $modelAttr) {
                $input[$modelAttr] = $row[$csvKey] ?? null;
            }

            foreach ($foreignKeyLookups as $fkAttr => $lookupConfig) {
                \Log::debug($fkAttr);
                if (!empty($input[$fkAttr])) {
                    $resolvedId = $this->getIdByLookup($lookupConfig, $input[$fkAttr]);

                    if ($resolvedId) {
                        $input[$fkAttr] = $resolvedId;
                    } else {
                        $translationKey = 'validation.custom.' . $fkAttr . '.no_valid_record';
                        $this->errors[] = [
                            'row' => $rowNumber,
                            'errors' => [__($translationKey, ['attribute' => __("validation.attributes.$fkAttr"), 'value' => $input[$fkAttr]], $this->userLocale)]
                        ];
                    }
                }
            }


            $validator = Validator::make($input, $rules);

            if ($validator->fails()) {
                $this->buildValidationOutput($validator->errors()->getMessages(), $rowNumber, $input);
                continue;
            }

            $uniqueBy = $modelClass::getImportUniqueBy();

            $uniqueValues = collect($uniqueBy)->mapWithKeys(fn($key) => [$key => $input[$key] ?? null])->toArray();

            $existing = $modelClass::where($uniqueValues)->exists();
            
            $mergedArray = array_merge($input, [
                    'updated_by' => $this->updatedBy,
                    ...(!$existing ? ['created_by' => $this->createdBy] : [])
            ]);

            $modelClass::updateOrCreate(
                $uniqueValues,
                $mergedArray
            );
        }

        if (!empty($this->errors)) {
            $this->sendFailureEmail();
        } else {
            $this->sendSuccessEmail();
        }
    }

    private function getIdByLookup(array $configArray, $valueToLookup)
    {
        $matchFields = (array)$configArray['match_on'];

        foreach ($matchFields as $matchOn) {
            $foundId = \DB::table($configArray['table'])->where($matchOn, $valueToLookup)->value('id');
            
            \Log::debug("Looked up [{$matchOn}] with value [{$valueToLookup}]", [
                "Found object?" => $foundId ? "Yes" : "No",
                "Object id" => $foundId ?: null,
            ]);

            if ($foundId) {
                return $foundId;
            }
        }
        return null;
    }

    /**
     * Summary of sendFailureEmail
     * @return void
     */
    private function sendFailureEmail()
    {
        $failFileName = 'failed-imports-' . now()->timestamp . '.xlsx';
        $failedImportPath = "imports/failed/{$failFileName}";

        Excel::store(new \App\Exports\FailedExports($this->caughtErrors, $this->userLocale), $failedImportPath);

        $this->importRun->update([
            'row_count' => $this->totalRowCount,
            'error_count' => count($this->errors),
            'status' => 'completed_with_errors',
            'output_file_path' => $failedImportPath,
        ]);

        $mailFilePath = storage_path('app/' . $failedImportPath);
        Mail::to($this->user)->send(new ImportReportMail(__('mail.imports.failure'), $mailFilePath, $this->user, true));
    }

    /**
     * Summary of sendSuccessEmail
     * @return void
     */
    private function sendSuccessEmail()
    {
        $this->importRun->update([
            'row_count' => $this->totalRowCount,
            'error_count' => 0,
            'status' => 'completed',
            'output_file_path' => null,
        ]);
        Mail::to($this->user)->send(new ImportReportMail(__('mail.imports.success'), "", $this->user));
    }

    /**
     * Summary of buildValidationOutput
     * @param array $errorMessages
     * @param int $rowWhereFailed
     * @param array $objectDefinitions
     * @return void
     */
    private function buildValidationOutput(array $errorMessages, int $rowWhereFailed, array $objectDefinitions): void
    {
        foreach ($errorMessages as $field => $messages) {
            foreach ($messages as $message) {
                $this->caughtErrors[] = [
                    ucfirst(__('actions.imports.row', [], $this->userLocale)) => $rowWhereFailed,
                    ucfirst(__('actions.imports.field', [], $this->userLocale)) => ucfirst(__('validation.attributes.' . $field)),
                    ucfirst(__('actions.imports.value', [], $this->userLocale)) => $objectDefinitions[$field] ?? null,
                    ucfirst(__('actions.imports.error_type', [], $this->userLocale)) => ucfirst(__('actions.imports.issue_types.validation', [], $this->userLocale)),
                    ucfirst(__('actions.imports.error_message', [], $this->userLocale)) => $message,
                ];
            }
        }
    }
}