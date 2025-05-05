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

    //TODO: FOR NOW, OBSOLETE
    /*public function __construct(UploadedFile $uploadedFile, bool $previewImport = $false, string $modelType, string $className)
    {
        $this->uploadedFile = $uploadedFile;
        $this->previewImport = $previewImport;
        $this->modelType = $modelType;
        $this->className = $className;
    }*/

    //TODO: use this function to maybe hanlde an import
    //and the parseInput() to just parse the data.
    public function processImport(): array
    {
        $importInstance = new $this->className();

        Excel::import($importInstance, $this->uploadedFile);

        if ($this->previewImport && method_exists($importInstance, 'getPreviewResult')) {
            // return redirect()->back()->with('success',$importInstance->getPreviewResult());
            return ['success',$importInstance->getPreviewResult()];
        }
        // return redirect()->back()->with('success', 'Import completed.');
        return ['success' => 'Import completed.'];
    }

    //TODO: use this function to retrieve the mappings for the import
    //so that the end-user themselves can choose what to import
    public function showMappings($model)
    {
        
    }
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

        // Load only the first row for headers
        $headings = Excel::toArray(null, $file)[0][0] ?? [];

        if (!is_array($headings)) {
            return response()->json(['error' => 'Unable to extract headers.'], 422);
        }

        return response()->json([
            'headers' => array_filter(array_map('trim', $headings)),
        ]);
    }

    //TODO: this should not do the full handling but only the provided
    //data
    /**
     * Checks if the model, file and class are existent for handling an import.
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    // public function parseInput(Request $request): RedirectResponse
    public function parseInput(): array
    {
        if (!$this->modelType || !$this->uploadedFile) {
            return ['failure' => 'Type and file are required.'];
        }

        $this->className = '\\App\\Imports\\' . Str::studly(Str::singular($this->modelType)) . 'Import';

        if (!class_exists(class: $this->className)) {
            // return redirect()->back()->with('failure', "Import class [$this->className] not found.");
            return ['failure' => "Import class [$this->className] not found."];
        }

        $this->showMappings(request());

        return $this->processImport();
    }

    //TODO: use this function to maybe hanlde an export
    //and the parseInput() to just parse the data.
    public function export(Request $request)
    {
        //
    }
}
