<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;

class ImportController extends Controller
{
    protected UploadedFile $uploadedFile;
    protected bool $previewImport;
    protected string $modelType;
    protected string $className;

    public function __construct(UploadedFile $uploadedFile, bool $previewImport = $false, string $modelType, string $className)
    {
        $this->uploadedFile = $uploadedFile;
        $this->previewImport = $previewImport;
        $this->modelType = $modelType;
        $this->className = $className;
    }

    //TODO: use this function to maybe hanlde an import
    //and the parseInput() to just parse the data.
    public function import(): array
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
    public function showMappings(Request $request)
    {
        //
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

        if (!class_exists($this->className)) {
            // return redirect()->back()->with('failure', "Import class [$this->className] not found.");
            return ['failure' => "Import class [$this->className] not found."];
        }

        return $this->import();
    }

    //TODO: use this function to maybe hanlde an export
    //and the parseInput() to just parse the data.
    public function export(Request $request)
    {
        //
    }
}
