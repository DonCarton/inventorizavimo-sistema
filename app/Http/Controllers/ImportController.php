<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;

class ImportController extends Controller
{
    public function import(Request $request)
    {
        //
    }

    public function handle(Request $request): RedirectResponse
    {
        $type = $request->input('type');
        $file = $request->file('upload');
        $isPreview = $request->boolean('preview');

        if (!$type || !$file) {
            return redirect()->back()->with('failure', 'Type and file are required.');
        }

        $className = '\\App\\Imports\\' . Str::studly(Str::singular($type)) . 'Import';

        if (!class_exists($className)) {
            return redirect()->back()->with('failure', "Import class [$className] not found.");
        }

        $importInstance = new $className($request->all());

        Excel::import($importInstance, $file);

        if ($isPreview && method_exists($importInstance, 'getPreviewResult')) {
            return redirect()->back()->with('success',$importInstance->getPreviewResult());
        }

        return response()->back()->with('success','Import completed.');
    }

    public function export(Request $request)
    {
        //
    }
}
