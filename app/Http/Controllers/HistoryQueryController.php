<?php

namespace App\Http\Controllers;

use App\Enums\ModelTypeValid;
use App\Http\Requests\HistoryLogRequest;
use App\Http\Resources\HistoryLogs\InventoryItemHistoryResource;

class HistoryQueryController extends Controller
{
    public function getLogs(HistoryLogRequest $request): \Illuminate\Http\JsonResponse
    {
        $modelClass = '\\App\\Models\\' . ModelTypeValid::from($request->object_type)->name;

        if (!class_exists($modelClass)) {
            return response()->json(['error' => 'Invalid type provided'], 400);
        }

        $model = $modelClass::find($request->object_id);

        if (!$model) {
            return response()->json(['error' => 'Object not found'], 404);
        }

        $query = $model->query();
        $perPage = $request->per_page;
        $query = $model->query()->paginate($perPage);

        return response()->json($query);
    }
    public function getObjectHistory(HistoryLogRequest $request): InventoryItemHistoryResource
    {

        // TODO: Better define the export, but we're almost there. Establish more relations
        $modelClass = '\\App\\Models\\' . ModelTypeValid::from($request->object_type)->name;

        $model = $modelClass::find($request->object_id);
        $logs = $model->activities()
            ->with(['subject','causer'])
            ->paginate($request->per_page);
        return new InventoryItemHistoryResource($logs);
    }
}
