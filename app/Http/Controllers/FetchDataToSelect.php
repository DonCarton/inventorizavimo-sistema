<?php

namespace App\Http\Controllers;

use App\Models\ItemType;
use App\Models\Laboratory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Request;

/**
 * Pirminis valdiklio panaudojimas, ištraukti informaciją iš
 * duomenų bazės ir ją perduoti į atitinkamus react-select laukus
 */
class FetchDataToSelect extends Controller
{
    public function listItemTypes(): JsonResponse
    {
        $itemTypes = ItemType::select('id', 'name')->get();
        return response()->json($itemTypes);
    }

    public function listLaboratories(): JsonResponse
    {
        $laboratories = Laboratory::select('id', 'name')->get();
        return response()->json($laboratories);
    }

    public function listCupboards(): ResourceCollection
    {
        $cupboards = \App\Models\InventoryItem::where('name', 'like', request('search') . '%')
            ->select('id','name','local_name')
            ->paginate(10);
        return \App\Http\Resources\SelectObjectResources\CupboardsForSelect::collection($cupboards);
    }
    public function getCupboard(int $id): JsonResponse
    {
        $cupboard = \App\Models\InventoryItem::findOrFail($id);
        $data = [
            'id' => $cupboard->id,
            'name' => $cupboard->name . ' [' . $cupboard->local_name . ']'
        ];
        return response()->json($data);
    }

    public function listShelves(): ResourceCollection
    {
        $shelves = \App\Models\InventoryItem::where('name', 'like', request('search') . '%')
            ->select('id','name','local_name')
            ->paginate(10);
        return \App\Http\Resources\SelectObjectResources\ShelvesForSelect::collection($shelves);
    }
    public function getShelf(int $id): JsonResponse
    {
        $shelf = \App\Models\InventoryItem::findOrFail($id);
        $data = [
            'id' => $shelf->id,
            'name' => $shelf->name . ' [' . $shelf->local_name . ']'
        ];
        return response()->json($data);
    }
    public function listIdentCode(): ResourceCollection
    {
        $identCodes = Laboratory::where('name', 'like', '%' . request('search') . '%')
            ->where(function ($query){
                $query->whereRaw('LENGTH(ident_code) > 0')
                ->orWhereNotNull('ident_code');
            })
            ->select('id','ident_code','name')
            ->paginate(10);
        return \App\Http\Resources\SelectObjectResources\IdentCodeForSelect::collection($identCodes);
    }

    public function listImportableFields(Request $request)
    {
        $modelClass = $request->input("model");

        if (!class_exists($request->input("model"))){
            return response()->json(['error' => 'Select object does not support imports'], 400);
        }
        
        $modelClass = $request->input("model");

        $model = new $modelClass;
        
        if (!in_array(\App\Interfaces\ImportableModel::class, class_implements($model))) {
            return response()->json(['error' => 'Select object does not support imports'], 400);
        }
        return response()->json([
            'fields' => $model->fetchValidFields(),
        ]);
    }
}
