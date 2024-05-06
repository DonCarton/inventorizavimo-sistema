<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryItemRequest;
use App\Http\Requests\UpdateInventoryItemRequest;
use App\Http\Resources\InventoryItemsResource;
use Illuminate\Http\RedirectResponse;
use App\Models\InventoryItems;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class InventoryItemsController extends Controller
{
    public function index(): Response
    {
        $query = InventoryItems::query();
        $inventoryItems = $query->paginate(3)->onEachSide(1);
        return Inertia::render('Inventory/Index',[
            'inventoryItems' => InventoryItemsResource::collection($inventoryItems)
        ]);
    }
    public function create(): Response
    {
        return Inertia::render('Inventory/Create');
    }
    public function store(StoreInventoryItemRequest $request): RedirectResponse
    {
        $data = $request->validated();

//        dd($data);
        InventoryItems::create($data);
        //dd($data);
        return to_route('inventoryItems.index');
    }
    public function update(UpdateInventoryItemRequest $request, InventoryItems $inventoryItem): RedirectResponse
    {
        $data = $request->validated();
        $inventoryItem->update($data);
        return Redirect::route('inventoryItems.index');
    }
    public function edit(InventoryItems $inventoryItem): Response
    {
        return Inertia::render('Inventory/Edit',[
            'inventoryItem' => new InventoryItemsResource($inventoryItem)
        ]);
    }
}
