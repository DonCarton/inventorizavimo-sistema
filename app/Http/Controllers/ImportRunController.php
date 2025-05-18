<?php

namespace App\Http\Controllers;

use App\Http\Resources\ImportRunResource;
use App\Models\ImportDefinition;
use App\Models\ImportRun;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ImportRunController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ImportRun::query();
        $sortField = $request->input("sort_field", "updated_at");
        $sortDirection = $request->input("sort_direction", "desc");
        if ($request["definition_name"]) {
            $query->whereHas('definition', function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request["definition_name"] . '%');
            });
        }
        $importRuns = $query->orderBy($sortField, $sortDirection)->paginate(10)->withQueryString()->onEachSide(1);
        return Inertia::render('ImportRun/Index',[
            'importRuns' => ImportRunResource::collection($importRuns),
            'queryParams' => $request->query() ?: null,
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
        $validated = $request->validate([
            'import_definition_id' => 'required|exists:import_definitions,id',
        ]);

        $importDefinition = ImportDefinition::findOrFail($validated['import_definition_id']);

        if ($request->boolean('run_after_save')) {
            $run = ImportRun::create([
                'import_definition_id' => $importDefinition->id,
                'file_path' => $importDefinition->file_path,
                'status' => 'pending',
            ]);
            dispatch(new \App\Jobs\RunImportJob($run));
        }

        return redirect()->route('import-definitions.index')->with('success', 'Import run saved successfully!');
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
