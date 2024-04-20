<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemTypeResource;
use App\Models\ItemTypes;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use function Termwind\render;

class ItemTypesController extends Controller
{
    public function index(): Response
    {
        $query = ItemTypes::query();
        $itemTypes = $query->paginate(10)->onEachSide(1);
        return Inertia::render('ItemTypes',[
            'itemTypes' => ItemTypeResource::collection($itemTypes)
        ]);
    }
    public function edit(ItemTypes $itemType): Response
    {
        return Inertia::render('ItemTypes/Edit',[
            'itemType' => new ItemTypeResource($itemType)
        ]);
    }
}
