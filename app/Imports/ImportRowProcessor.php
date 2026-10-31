<?php

namespace App\Imports;

use App\Imports\Helpers\ImportHelper;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

/**
 * Validates and persists import rows for a given model + field mapping.
 * Shared by the real import (GenericImport) and the dry run (DryRunImport),
 * so the pre-upload check exercises exactly the same code path.
 */
class ImportRowProcessor
{
    protected string $validationFileName = "steam_validations";

    /** Text accepted for boolean fields (compared case-insensitively, trimmed). */
    protected const TRUE_VALUES = ['1', 'true', 'yes', 'taip'];

    protected const FALSE_VALUES = ['0', 'false', 'no', 'ne'];

    protected array $normalizedMapping;

    protected array $foreignKeyLookups;

    public function __construct(
        protected string $modelClass,
        array $fieldMappings,
        ?array $foreignKeyLookups,
        protected string $locale,
        protected int $createdBy,
        protected int $updatedBy,
    ) {
        $this->normalizedMapping = collect($fieldMappings)
            ->filter(fn($modelAttr) => !is_null($modelAttr) && $modelAttr !== '')
            ->mapWithKeys(fn($modelAttr, $csvKey) => [Str::slug($csvKey, '_') => $modelAttr])
            ->toArray();

        $this->foreignKeyLookups = $foreignKeyLookups ?? $modelClass::getImportForeignKeyLookups();
    }

    /**
     * Processes every row and returns the collected errors.
     * Each row runs in its own (nested) transaction, so a row that fails at the
     * database level is rolled back on its own and the remaining rows still run.
     *
     * @param Collection $rows rows keyed by slugged heading (WithHeadingRow)
     * @param callable|null $onSaved called with the saved model, inside the row's transaction
     * @return array<int, array{row:int, field:string, value:mixed, type:string, message:string, attribute:string}>
     */
    public function process(Collection $rows, ?callable $onSaved = null): array
    {
        $rules = Config::get("{$this->validationFileName}.{$this->modelClass}", []);
        $booleanFields = $this->booleanFields($rules);
        $errors = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;

            $input = [];
            foreach ($this->normalizedMapping as $csvKey => $modelAttr) {
                $input[$modelAttr] = $this->clean($row[$csvKey] ?? null);
            }

            // Only mapped columns are in $input, so a boolean column missing from
            // the file stays untouched (new items: NULL, existing items: kept).
            foreach ($booleanFields as $field) {
                if (array_key_exists($field, $input)) {
                    $input[$field] = $this->normalizeBoolean($input[$field]);
                }
            }

            $finalRules = ImportHelper::buildRowValidationRules($this->modelClass, $rules, $input);
            $validator = Validator::make($input, $finalRules);

            if ($validator->fails()) {
                foreach ($validator->errors()->getMessages() as $field => $messages) {
                    foreach ($messages as $message) {
                        $errors[] = $this->error($rowNumber, $field, $input[$field] ?? null, 'validation', $message);
                    }
                }
                continue;
            }

            [$input, $manyToMany, $lookupErrors] = $this->resolveForeignKeys($input, $rowNumber);

            if (!empty($lookupErrors)) {
                array_push($errors, ...$lookupErrors);
                continue;
            }

            try {
                DB::transaction(function () use ($input, $manyToMany, $onSaved) {
                    $this->persist($input, $manyToMany, $onSaved);
                });
            } catch (\Throwable $e) {
                Log::warning('Import row failed', ['row' => $rowNumber, 'model' => $this->modelClass, 'error' => $e->getMessage()]);
                $errors[] = $this->error($rowNumber, '', null, 'exception', $e->getMessage());
            }
        }

        return $errors;
    }

    /**
     * Strips invisible leading/trailing whitespace (incl. line breaks, non-breaking
     * and zero-width spaces, BOM) from text cells, like web forms trim input.
     * Line breaks inside the value are kept; a whitespace-only cell becomes null.
     */
    protected function clean(mixed $value): mixed
    {
        if (!is_string($value)) {
            return $value;
        }

        $cleaned = preg_replace('~^[\s\x{FEFF}\x{200B}]+|[\s\x{FEFF}\x{200B}]+$~u', '', $value) ?? trim($value);

        return $cleaned === '' ? null : $cleaned;
    }

    /**
     * Fields validated with the 'boolean' rule.
     */
    protected function booleanFields(array $rules): array
    {
        return collect($rules)
            ->filter(fn($fieldRules) => in_array('boolean', (array) $fieldRules, true))
            ->keys()
            ->all();
    }

    /**
     * An empty cell means "no" (the export writes false that way in older files),
     * and common spellings (true/false, yes/no, taip/ne, 1/0) in any case are accepted.
     * Anything else is returned unchanged so the 'boolean' rule rejects it with the original value.
     */
    protected function normalizeBoolean(mixed $value): mixed
    {
        if (is_bool($value)) {
            return $value;
        }

        $normalized = mb_strtolower(trim((string) $value));

        if ($normalized === '' || in_array($normalized, self::FALSE_VALUES, true)) {
            return false;
        }

        if (in_array($normalized, self::TRUE_VALUES, true)) {
            return true;
        }

        return $value;
    }

    /**
     * Replaces lookup values (names, codes) with ids. Many-to-many values are
     * pulled out of the input and returned separately for syncing.
     */
    protected function resolveForeignKeys(array $input, int $rowNumber): array
    {
        $manyToMany = [];
        $errors = [];

        foreach ($this->foreignKeyLookups as $fkAttr => $lookupConfig) {
            $rawValue = $input[$fkAttr] ?? null;

            if (empty($rawValue)) {
                continue;
            }

            if ($lookupConfig['many_to_many']) {
                $collectedValues = collect(explode('|', $rawValue))->map(fn($value) => trim($value))->filter();

                // Values may be names or numeric ids, same as the ExistsByNumericOrString rule accepts.
                $numericValues = $collectedValues->filter(fn($value) => is_numeric($value));

                $resolvedIds = DB::table($lookupConfig['table'])
                    ->where(function ($query) use ($lookupConfig, $collectedValues, $numericValues) {
                        $query->whereIn($lookupConfig['match_on'], $collectedValues);
                        if ($numericValues->isNotEmpty()) {
                            $query->orWhereIn('id', $numericValues);
                        }
                    })
                    ->pluck('id')
                    ->unique()
                    ->values()
                    ->toArray();

                if (empty($resolvedIds)) {
                    $errors[] = $this->lookupError($rowNumber, $fkAttr, $rawValue);
                    continue;
                }

                $manyToMany[$fkAttr] = $resolvedIds;
                unset($input[$fkAttr]);
            } else {
                $resolvedId = $this->getIdByLookup($lookupConfig, $rawValue);

                if ($resolvedId) {
                    $input[$fkAttr] = $resolvedId;
                } else {
                    $errors[] = $this->lookupError($rowNumber, $fkAttr, $rawValue);
                }
            }
        }

        return [$input, $manyToMany, $errors];
    }

    protected function persist(array $input, array $manyToMany, ?callable $onSaved): void
    {
        $modelClass = $this->modelClass;

        $uniqueValues = collect($modelClass::getImportUniqueBy())
            ->mapWithKeys(fn($key) => [$key => $input[$key] ?? null])
            ->toArray();

        $existing = $modelClass::where($uniqueValues)->exists();

        $model = $modelClass::updateOrCreate($uniqueValues, array_merge($input, [
            'updated_by' => $this->updatedBy,
            ...(!$existing ? ['created_by' => $this->createdBy] : []),
        ]));

        if ($onSaved) {
            $onSaved($model);
        }

        foreach ($manyToMany as $relation => $relatedIds) {
            $model->$relation()->sync($relatedIds);
        }

        if (method_exists($model, 'syncFacilitiesFromLaboratories')) {
            $model->syncFacilitiesFromLaboratories();
        }
    }

    protected function getIdByLookup(array $configArray, $valueToLookup)
    {
        foreach ((array) $configArray['match_on'] as $matchOn) {
            $foundId = DB::table($configArray['table'])->where($matchOn, $valueToLookup)->value('id');

            if ($foundId) {
                return $foundId;
            }
        }

        // Fall back to a numeric id, which the ExistsByNumericOrString validation rule also accepts.
        if (is_numeric($valueToLookup) && DB::table($configArray['table'])->where('id', $valueToLookup)->exists()) {
            return (int) $valueToLookup;
        }

        return null;
    }

    protected function lookupError(int $rowNumber, string $fkAttr, $value): array
    {
        $message = __('validation.custom.' . $fkAttr . '.no_valid_record', [
            'attribute' => $this->fieldLabel($fkAttr),
            'value' => $value,
        ], $this->locale);

        return $this->error($rowNumber, $fkAttr, $value, 'validation', $message);
    }

    /**
     * Human-readable name of an attribute: the validation attribute name if one
     * is defined, otherwise the field label shown in the mapping, otherwise the key.
     */
    protected function fieldLabel(string $field): string
    {
        foreach (["validation.attributes.{$field}", "inventory_item.{$field}"] as $translationKey) {
            $label = __($translationKey, [], $this->locale);
            if (is_string($label) && $label !== $translationKey) {
                return $label;
            }
        }

        return $field;
    }

    protected function error(int $rowNumber, string $field, $value, string $type, string $message): array
    {
        return [
            'row' => $rowNumber,
            'field' => $field === '' ? '' : ucfirst($this->fieldLabel($field)),
            'value' => is_scalar($value) || is_null($value) ? $value : json_encode($value),
            'type' => ucfirst(__('actions.imports.issue_types.' . $type, [], $this->locale)),
            'message' => $message,
            // Raw attribute key, used by the UI to highlight preview cells. Not exported.
            'attribute' => $field,
        ];
    }
}
