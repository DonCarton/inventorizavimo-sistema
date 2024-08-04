<?php

namespace App\Http\Controllers;

use App\Enums\ModelTypeValid;
use App\Http\Requests\HistoryLogRequest;

class HistoryQueryController extends Controller
{
    public function getLogs(HistoryLogRequest $request)
    {
        $modelClass = '\\App\\Models\\' . ModelTypeValid::from($request->object_type)->name;

        if (!class_exists($modelClass)) {
            return response()->json(['error' => 'Invalid type provided'], 400);
        }

        $model = $modelClass::find($request->object_id);

        if (!$model) {
            return response()->json(['error' => 'Object not found'], 404);
        }

        $query = $model->activities();
        $perPage = $request->per_page;

        return response()->json($query->paginate($perPage));
    }
}
