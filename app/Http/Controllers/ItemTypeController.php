<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemTypeResource;
use App\Models\ItemType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use function Termwind\render;

class ItemTypeController extends Controller
{
    public function index(): Response
    {
//        auth()->user()->assignRole('admin');
        $query = ItemType::query();
        $itemTypes = $query->paginate(10)->onEachSide(1);
        return Inertia::render('ItemTypes/Index',[
            'itemTypes' => ItemTypeResource::collection($itemTypes)
        ]);
    }
    public function edit(ItemType $itemType): Response
    {
        return Inertia::render('ItemTypes/Edit',[
            'itemType' => new ItemTypeResource($itemType)
        ]);
    }
}
