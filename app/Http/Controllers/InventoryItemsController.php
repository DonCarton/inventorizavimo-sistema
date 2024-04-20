<?php

namespace App\Http\Controllers;

use App\Http\Resources\InventoryItemsResource;
use App\Models\InventoryItems;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryItemsController extends Controller
{
    public function index(): Response
    {
        $query = InventoryItems::query();

        $inventoryItems = $query->paginate(10)->onEachSide(1);

        return Inertia::render('InventoryItems',[
            'inventoryItems' => InventoryItemsResource::collection($inventoryItems)
        ]);
    }
}
