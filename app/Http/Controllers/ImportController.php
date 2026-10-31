<?php

namespace App\Http\Controllers;

use App\Imports\DryRunImport;
use App\Imports\Helpers\ImportFile;
use App\Imports\ImportRowProcessor;
use App\Imports\PreviewImport;
use App\Interfaces\ImportableModel;
use App\Models\ImportDefinition;
use App\ValidAttributes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\UploadedFile;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;

class ImportController extends Controller
{
    use ValidAttributes;

    private const DRY_RUN_ERROR_LIMIT = 100;
    protected UploadedFile $uploadedFile;
    protected bool $previewImport;
    protected string $modelType;
    protected string $className;

    public function getImportableFields(Request $request)
    {
        $validated = $request->validate([
            "model" => ["required", "string"],
        ]);

        if (!class_exists($validated["model"])) {
            return response()->json(
                ["error" => "Selected object does not support imports"],
                422,
            );
        }

        $modelClass = $validated["model"];

        $model = new $modelClass();

        $humanReadableFields = $model->makeHumanReadable(
            $model->fetchValidFields(),
            "InventoryItem",
        );

        if (
            !in_array(
                \App\Interfaces\ImportableModel::class,
                class_implements($model),
            )
        ) {
            return response()->json(
                ["error" => "Selected object does not support imports"],
                400,
            );
        }

        return response()->json([
            "fields" => $model->fetchValidFields(),
            "humanReadable" => $humanReadableFields,
            "aliases" => $this->fieldAliases(array_keys($humanReadableFields)),
        ]);
    }

    /**
     * Slugged names a file column may carry to be auto-mapped to each field:
     * the field key itself plus its label in every app language. Slugged the
     * same way as extractHeaders() normalizes file headers, so the frontend
     * only needs an exact comparison.
     */
    private function fieldAliases(array $fieldKeys): array
    {
        $locales = collect(File::directories(lang_path()))->map(fn($dir) => basename($dir));

        return collect($fieldKeys)->mapWithKeys(function ($key) use ($locales) {
            $translationKey = "inventory_item.{$key}";

            $labels = $locales
                ->map(fn($locale) => __($translationKey, [], $locale))
                ->filter(fn($label) => is_string($label) && $label !== $translationKey);

            $aliases = $labels->prepend($key)
                ->map(fn($name) => Str::slug($name, "_"))
                ->filter()
                ->unique()
                ->values()
                ->all();

            return [$key => $aliases];
        })->all();
    }

    /**
     * Soft upload: runs the import for the given file + mapping inside a
     * transaction that is rolled back, and reports what would fail.
     * The file comes either from the request (Create) or from a stored
     * import definition (Edit).
     */
    public function dryRun(Request $request)
    {
        $validated = $request->validate([
            "model_class" => ["required", "string"],
            "field_mappings" => ["required", "array"],
            "import_definition_id" => ["nullable", "integer", "exists:import_definitions,id"],
            "file" => ["required_without:import_definition_id", "nullable", "file", "max:7168", "mimes:xlsx,csv,txt"],
        ]);

        $modelClass = $validated["model_class"];

        if (!class_exists($modelClass) || !in_array(ImportableModel::class, class_implements($modelClass))) {
            return response()->json(
                ["error" => "Selected object does not support imports"],
                422,
            );
        }

        $fieldMappings = array_filter(
            $validated["field_mappings"],
            fn($v) => !is_null($v) && $v !== "",
        );

        if (empty($fieldMappings)) {
            throw ValidationException::withMessages([
                "field_mappings" => __("validation.required", ["attribute" => "field mappings"]),
            ]);
        }

        $file = $request->file("file")
            ?? Storage::path(ImportDefinition::findOrFail($request->input("import_definition_id"))->file_path);

        $processor = new ImportRowProcessor(
            modelClass: $modelClass,
            fieldMappings: $fieldMappings,
            foreignKeyLookups: null,
            locale: app()->getLocale(),
            createdBy: auth()->id(),
            updatedBy: auth()->id(),
        );

        $dryRun = new DryRunImport($processor);
        Excel::import($dryRun, ImportFile::readable($file));

        return response()->json([
            "passed" => empty($dryRun->errors),
            "total_rows" => $dryRun->totalRows,
            "error_count" => count($dryRun->errors),
            "errors" => array_slice($dryRun->errors, 0, self::DRY_RUN_ERROR_LIMIT),
        ]);
    }

    public function extractHeaders(Request $request)
    {
        $request->validate([
            "file" => ["required", "file", "max:7168", "mimes:xlsx,csv,txt"],
        ]);

        $file = $request->file("file");

        $headings = $this->fetchHeaders($file);

        if (!is_array($headings)) {
            return response()->json(
                ["error" => "Unable to extract headers."],
                422,
            );
        }

        $normalizedHeaders = collect($headings)
            ->map(function ($header) {
                return $header ? Str::slug($header, "_") : null;
            })
            ->all();

        return response()->json([
            "rawHeaders" => $headings,
            "normalizedHeaders" => $normalizedHeaders,
            "sampleRows" => $this->fetchSampleRows($file),
        ]);
    }

    public static function fetchSampleRows(UploadedFile $file, int $limit = 10): array
    {
        $rows = Excel::toArray(new PreviewImport(), ImportFile::readable($file));

        if (empty($rows) || empty($rows[0])) {
            return [];
        }

        return collect($rows[0])
            ->slice(1, $limit)
            ->map(fn($row) => array_map(
                fn($cell) => match (true) {
                    is_null($cell) => null,
                    is_bool($cell) => $cell ? "TRUE" : "FALSE",
                    default => (string) $cell,
                },
                $row,
            ))
            ->values()
            ->all();
    }

    public static function fetchHeaders(UploadedFile $file)
    {
        $rows = Excel::toArray(new PreviewImport(), ImportFile::readable($file));

        if (empty($rows) || empty($rows[0])) {
            return [];
        }

        $firstRow = $rows[0][0] ?? [];

        $headers = [];

        foreach ($firstRow as $header) {
            if (is_null($header) || trim($header) === "") {
                break;
            }

            $headers[] = trim((string) $header);
        }

        return $headers;
    }
}
