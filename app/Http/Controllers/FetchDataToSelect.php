<?php

namespace App\Http\Controllers;

use App\Models\ItemType;
use App\Models\Laboratory;
use Illuminate\Http\JsonResponse;
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
}
