<?php

namespace App\Http\Controllers;

use App\ValidAttributes;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;

class ImportController extends Controller
{
    use ValidAttributes;
    protected UploadedFile $uploadedFile;
    protected bool $previewImport;
    protected string $modelType;
    protected string $className;

    public function getImportableFields(Request $request)
    {
        $validated = $request->validate([
            'model' => ['required', 'string'],
        ]);

        if (!class_exists($validated['model'])){
            return response()->json(['error' => 'Selected object does not support imports'], 422);
        }
        
        $modelClass = $validated["model"];

        $model = new $modelClass;

        $humanReadableFields = $model->makeHumanReadable($model->fetchValidFields(), 'InventoryItem');
        
        if (!in_array(\App\Interfaces\ImportableModel::class, class_implements($model))) {
            return response()->json(['error' => 'Selected object does not support imports'], 400);
        }

        return response()->json([
            'fields' => $model->fetchValidFields(),
            'humanReadable' => $humanReadableFields,
        ]);
    }
    public function extractHeaders(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,csv,txt'],
        ]);

        $file = $request->file('file');

        $headings = $this->fetchHeaders($file);

        if (!is_array($headings)) {
            return response()->json(['error' => 'Unable to extract headers.'], 422);
        }

        $normalizedHeaders = collect($headings)->map(function ($header) {
            return $header ? Str::slug($header, '_') : null;
        })->all();

        return response()->json([
            'rawHeaders' => $headings,
            'normalizedHeaders' => $normalizedHeaders,
        ]);
    }

    public static function fetchHeaders(UploadedFile $file)
    {
        $rows = Excel::toArray(null, $file);

        if (empty($rows) || empty($rows[0])) {
            return [];
        }

        $firstRow = $rows[0][0] ?? [];

        $headers = [];

        foreach ($firstRow as $header) {
            if (is_null($header) || trim($header) === '') {
                break;
            }

            $headers[] = trim((string)$header);
        }

        return $headers;
    }
}
