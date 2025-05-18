<?php

namespace App\Http\Controllers;

use App\Http\Resources\ImportDefinitionResource;
use App\Models\ImportDefinition;
use App\Interfaces\ImportableModel;
use DB;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;
use ReflectionClass;
use Storage;

class DataFileImportController extends Controller
{
    public static function getImportableModels(): array
    {
        $modelsPath = app_path('Models');
        $modelsNamespace = 'App\\Models\\';

        $importableModels = [];

        foreach (File::allFiles($modelsPath) as $file) {
            $relativePath = $file->getRelativePathname();
            
            $className = str_replace(['/', '.php'], ['\\', ''], $relativePath);
            $class = $modelsNamespace . $className;
            $userFriendlyName = __('objects.'.$class);

            if (!class_exists($class)) {
                continue;
            }

            $reflection = new ReflectionClass($class);

            if ($reflection->isInstantiable() && $reflection->implementsInterface(ImportableModel::class))
            {
                $importableModels[] = [
                    'value' => $class,
                    'label' => $userFriendlyName,
                ];
            }
        }

        return $importableModels;
    }
    /**
     * Display a listing of the import definitions.
     * @param Request $request
     */
    public function index(Request $request): Response
    {

        $query = ImportDefinition::query();
        $sortField = $request->input("sort_field", "updated_at");
        $sortDirection = $request->input("sort_direction", "desc");


        if ($request["name"]) {
            $query->where('name', 'like', '%' . $request["name"] . '%');
        }

        $importDefinitions = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->withQueryString()->onEachSide(1);

        return Inertia::render('Import/Index', [
            'importDefinitions' => ImportDefinitionResource::collection($importDefinitions),
            'queryParams' => $request->query() ?: null,
        ]);
    }

    /**
     * Show the form for creating a new import definition.
     */
    public function create(): Response
    {
        $importableObjects = DataFileImportController::getImportableModels();
        return Inertia::render('Import/Create',[
            'importableObjects' => $importableObjects,
        ]);
    }

    /**
     * Store a new import definition.
     * @param Request $request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'model_class' => 'required|string',
            'file' => 'required|file|mimes:xlsx,xls,csv',
            'field_mappings' => 'required|array',
            'created_by' => 'required|exists:users,id',
            'updated_by' => 'required|exists:users,id',
        ]);

        $originalName = $request->file('file')->getClientOriginalName();
        $cleanedName = str_replace(' ', '_', $originalName);

        // $path = $request->file("file")->store("imports", 'local');
        $path = $request->file('file')->storeAs('imports', $cleanedName);

        $validated['field_mappings'] = array_filter(
            $validated['field_mappings'],
            fn($v) => !is_null($v) && $v !== ''
        );

        $validated['file_path'] = $path;

        $importDefinition = ImportDefinition::create($validated);

        $importRun = \App\Models\ImportRun::create([
            'import_definition_id' => $importDefinition->id,
            'file_path' => $importDefinition->file_path,
            'status' => 'pending',
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        if ($request->input('import')){

            dispatch(new \App\Jobs\RunImportJob($importRun, auth()->user()));
            return redirect()->route('import-definitions.index')->with('success', __('actions.importDefinition.created_and_import',['name'=>$importDefinition->name]));

        }

        return redirect()->route('import-definitions.index')->with('success', __('actions.importDefinition.created', ['name' => $importDefinition->name]));
    }

    /**
     * Show the form to edit an import definition.
     * @param ImportDefinition $importDefinition
     */
    public function edit(ImportDefinition $importDefinition): Response
    {
        $tempPath = Storage::path($importDefinition->file_path);
        $existingfile = new UploadedFile($tempPath, originalName: basename($tempPath));
        $headers = ImportController::fetchHeaders($existingfile);

        return Inertia::render('Import/Edit',[
            'importableObjects' => DataFileImportController::getImportableModels(),
            'fileDownloadUrl' => $importDefinition->file_path
                ? route('imports.download', $importDefinition->id)
                : null,
            'headers' => $headers,
            'originalFilename' => basename($importDefinition->file_path),
            'importDefinition' => $importDefinition,
        ]);
    }

    /**
     * Update the import definition.
     * @param Request $request
     * @param ImportDefinition $importDefinition
     */
    public function update(Request $request, ImportDefinition $importDefinition)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'model_class' => 'required|string',
            'file' => 'nullable|file|mimes:xlsx,xls,csv',
            'field_mappings' => 'required|array',
        ]);

        $importDefinition->update($validated);

        return redirect()->route('import-definitions.index')->with('success', __('actions.importDefinition.updated', ['name' => $validated['name']]));
    }

    /**
     * Delete the import definition.
     * @param ImportDefinition $importDefinition
     */
    public function destroy(ImportDefinition $importDefinition)
    {
        $nameOfDefinition = $importDefinition->name;
        $importDefinition->delete();

        return redirect()->route('import-definitions.index')->with('success', __('actions.importDefinition.deleted', ['name' => $nameOfDefinition]));
    }
}
