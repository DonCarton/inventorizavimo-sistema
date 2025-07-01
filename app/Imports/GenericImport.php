<?php

namespace App\Imports;

use App\Imports\Helpers\ImportHelper;
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

        $modelClass = $definition->model_class;

        $fullValidationPath = "{$this->validationFileName}.{$modelClass}";

        $rules = Config::get($fullValidationPath, []);

        $foreignKeyLookups = $definition->foreign_key_lookups ?? $modelClass::getImportForeignKeyLookups();

        $manyToManyCollection = [];

        foreach ($rows as $index => $row) {

            $rowNumber = $index + 2;

            $input = [];
            foreach ($normalizedMapping as $csvKey => $modelAttr) {
                $input[$modelAttr] = $row[$csvKey] ?? null;
            }

            $finalRules = ImportHelper::buildRowValidationRules($modelClass, $rules, $input);

            $validator = Validator::make($input, $finalRules);

            if ($validator->fails()) {
                $this->buildValidationOutput($validator->errors()->getMessages(), $rowNumber, $input);
                continue;
            }

            foreach ($foreignKeyLookups as $fkAttr => $lookupConfig) {

                $rawValue = $input[$fkAttr] ?? null;

                if (empty($rawValue)) {
                    continue;
                }

                if ($lookupConfig['many_to_many']) {
                    
                    $collectedValues = collect(explode('|',$rawValue))->map(fn($value) => trim($value))->filter();
                    
                    $resolvedIds = \DB::table($lookupConfig['table'])
                        ->whereIn($lookupConfig['match_on'], $collectedValues)
                        ->pluck('id')
                        ->toArray();

                    if (empty($resolvedIds)) {
                        $this->caughtErrors[] = [
                            'row' => $rowNumber,
                            'errors' => [__('validation.custom.' . $fkAttr . '.no_valid_record', ['attribute' => __("validation.attributes.$fkAttr"), 'value' => $rawValue], $this->userLocale)]
                        ];
                        continue;
                    }

                    $manyToManyCollection[$fkAttr] = $resolvedIds;

                    unset($input[$fkAttr]);

                } else {
                    
                    $resolvedId = $this->getIdByLookup($lookupConfig, $input[$fkAttr]);

                    if ($resolvedId) {
                        $input[$fkAttr] = $resolvedId;
                    } else {
                        $translationKey = 'validation.custom.' . $fkAttr . '.no_valid_record';
                        $this->caughtErrors[] = [
                            'row' => $rowNumber,
                            'errors' => [__($translationKey, ['attribute' => __("validation.attributes.$fkAttr"), 'value' => $input[$fkAttr]], $this->userLocale)]
                        ];
                    }
                }
            }

            $uniqueBy = $modelClass::getImportUniqueBy();

            $uniqueValues = collect($uniqueBy)->mapWithKeys(fn($key) => [$key => $input[$key] ?? null])->toArray();

            $existing = $modelClass::where($uniqueValues)->exists();
            
            $mergedArray = array_merge($input, [
                    'updated_by' => $this->updatedBy,
                    ...(!$existing ? ['created_by' => $this->createdBy] : [])
            ]);

            $updatedOrCreatedModel = $modelClass::updateOrCreate(
                $uniqueValues,
                $mergedArray
            );

            foreach ($manyToManyCollection as $relation => $relatedIds){
                $updatedOrCreatedModel->$relation()->sync($relatedIds);
            }
            
        }

        if (!empty($this->caughtErrors)) {
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
            'error_count' => count($this->caughtErrors),
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