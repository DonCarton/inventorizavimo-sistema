<?php

namespace App\Http\Controllers;

use App\Models\ItemType;
use App\Models\Laboratory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

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

    public function listCupboards(): JsonResponse
    {
        $cupboards = \App\Models\InventoryItem::where('name', 'like', request('search') . '%')
            ->select('id','name', 'local_name')->get();
//            ->paginate(10);
//        return \App\Http\Resources\SelectObjectResources\CupboardsForSelect::collection($cupboards);
        return response()->json($cupboards);
    }
    public function getCupboard(int $id): JsonResponse
    {
        $cupboard = \App\Models\InventoryItem::findOrFail($id);
        $data = [
            'id' => $cupboard->id,
            'name' => $cupboard->name
        ];
        return response()->json($data);
    }

    public function listShelves(): JsonResponse
    {
        $shelves = \App\Models\InventoryItem::where('name', 'like', request('search') . '%')
            ->select('id','name', 'local_name')->get();
//            ->paginate(10);
//        return \App\Http\Resources\SelectObjectResources\ShelvesForSelect::collection($shelves);
        return response()->json($shelves);
    }
}
