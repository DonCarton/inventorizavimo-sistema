<?php

namespace App\Http\Controllers;

use App\Models\ImportDefinition;
use App\Models\ImportRun;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ImportRunController extends Controller
{
    protected string $nameOfDefinition;
    protected string $typeOfImport;
    protected string $successMessage;
    public function __construct(string $name, string $type)
    {
        $this->nameOfDefinition = $name;
        $this->typeOfImport = $type;
    }

    public function index(): Response
    {
        $importRuns = ImportRun::paginate(10);
        return Inertia::render('ImportRun/Index',[
            'importRuns' => $importRuns
        ]);
    }
    public function create(): Response
    {
        $importDefinitions = ImportDefinition::all();
        return Inertia::render('ImportRun/Create',[
            'importDefinitions' => $importDefinitions
        ]);
    }

    public function store(Request $request)
    {        
        return redirect()->route('import-runs.index')->with('success','Created');
    }

    public function edit(ImportRun $importRun): Response
    {
        return Inertia::render('ImportRun/Edit',[
            'importRun' => $importRun
        ]);
    }

    public function update(Request $request, ImportRun $importRun)
    {
        return redirect()->route('import-runs.index')->with('success','Updated');
    }

    public function destroy(ImportRun $importRun)
    {
        return redirect()->route('import-runs.index')->with('success','Deleted');
    }
}
