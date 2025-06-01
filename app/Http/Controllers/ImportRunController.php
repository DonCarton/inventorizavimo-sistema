<?php

namespace App\Http\Controllers;

use App\Http\Resources\EditResources\ImportRunEditResource;
use App\Http\Resources\ImportRunResource;
use App\Models\ImportDefinition;
use App\Models\ImportRun;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ImportRunController extends Controller
{
    protected array $translationStrings; 
    public function __construct()
    {
        $this->translationStrings = __('model_attributes.import_run.status',[],auth()->user()->locale);
    }
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
        if ($request["status"]) {
            $query->where('status', '=', $request["status"]);
        }
        $importRuns = $query->orderBy($sortField, $sortDirection)->paginate(10)->withQueryString()->onEachSide(1);
        return Inertia::render('ImportRun/Index',[
            'importRuns' => ImportRunResource::collection($importRuns),
            'importStatuses' => $this->getImportStatuses(),
            'queryParams' => $request->query() ?: null,
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route('import-runs.index')->with('warning',__('actions.unavailable'));
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
            dispatch(new \App\Jobs\RunImportJob($run, auth()->user()));
        }

        return redirect()->route('import-definitions.index')->with('success', __('actions.importRun.created', [
            'name' => $importDefinition->name,
        ]));
    }

    public function edit(ImportRun $importRun): Response
    {
        return Inertia::render('ImportRun/Edit',[
            'importRun' => new ImportRunEditResource($importRun),
            'importStatuses' => $this->getImportStatuses(),
        ]);
    }

    public function update(Request $request, ImportRun $importRun)
    {

        $validated = $request->validate([
            'file' => 'nullable|file|mimes:xlsx,xls,csv',
        ]);

        if ($validated['file']){
            $originalName = $request->file('file')->getClientOriginalName();
            $cleanedName = str_replace(' ', '_', $originalName);
            $path = $request->file('file')->storeAs('imports', $cleanedName);
            $validated['file_path'] = $path;
        }

        $importRun->update($validated);
        return redirect()->route('import-runs.index')->with('success',__('actions.importRun.updated', [
            'name' => $importRun->definition->name,
        ]));
    }

    public function destroy(ImportRun $importRun)
    {
        $nameOfDefinition = $importRun->definition->name;
        $importRun->delete();

        return redirect()->route('import-runs.index')->with('success', __('actions.importRun.deleted', ['name' => $nameOfDefinition]));
    }

    public function requeue(ImportRun $importRun)
    {
        if ($importRun->status == 'running'){
            return redirect()->route('import-runs.index')->with('failure',__('actions.importRun.requeue.running', [
                'name' => $importRun->definition->name
            ]));
        }
        $importRun->update([
            'status' => 'pending'
        ]);
        dispatch(new \App\Jobs\RunImportJob($importRun, auth()->user()));
        return redirect()->route('import-runs.index')->with('success',__('actions.importRun.requeue.success', [
            'name' => $importRun->definition->name
        ]));
    }

    private function getImportStatuses(): Collection
    {
        return collect($this->translationStrings)->map(fn($label, $key) => [
                    'value' => $key,
                    'label' => $label,
        ])->values();
    }
}
