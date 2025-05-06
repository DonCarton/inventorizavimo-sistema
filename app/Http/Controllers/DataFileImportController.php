<?php

namespace App\Http\Controllers;

use App\Models\ImportDefinition;
use App\Interfaces\ImportableModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;
use ReflectionClass;

class DataFileImportController extends Controller
{
    public static function getImportableModels(): array
    {
        $modelsPath = app_path('Models');
        $modelsNamespace = 'App\\Models\\';

        $importableModels = [];

        foreach (File::allFiles($modelsPath) as $file) {
            $relativePath = $file->getRelativePathname(); // e.g., InventoryItem.php
            $className = str_replace(['/', '.php'], ['\\', ''], $relativePath);
            $class = $modelsNamespace . $className;

            if (!class_exists($class)) {
                continue;
            }

            $reflection = new ReflectionClass($class);

            if ($reflection->isInstantiable() && $reflection->implementsInterface(ImportableModel::class))
            {
                $importableModels[] = [
                    'value' => $class,
                    'label' => $className,
                ];
            }
        }

        return $importableModels;
    }
    /**
     * Display a listing of the resource.
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
            'importDefinitions' => $importDefinitions,
            'queryParams' => $request->query() ?: null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
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
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'model_class' => 'required|string',
            'field_mappings' => 'required|array',
        ]);

        $validated['field_mappings'] = array_filter(
            $validated['field_mappings'],
            fn($v) => !is_null($v) && $v !== ''
        );

        ImportDefinition::create($validated);

        return redirect()->route('import-definitions.index')->with('success', 'Import definition saved successfully!');
    }

    /**
     * Show the form to edit an import definition.
     */
    public function edit(ImportDefinition $importDefinition): Response
    {
        return Inertia::render('Import/Edit',[
            'importableObjects' => DataFileImportController::getImportableModels(),
            'importDefinition' => $importDefinition,
        ]);
    }

    /**
     * Update the import definition.
     */
    public function update(Request $request, ImportDefinition $importDefinition)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'model_class' => 'required|string|class_exists',
            'field_mappings' => 'required|array',
        ]);

        $importDefinition->update($validated);

        return redirect()->route('import-definitions.index')->with('success', 'Import definition updated successfully!');
    }

    /**
     * Delete the import definition.
     */
    public function destroy(ImportDefinition $importDefinition)
    {
        $importDefinition->delete();

        return redirect()->route('import-definitions.index')->with('success', 'Import definition deleted successfully!');
    }
}
