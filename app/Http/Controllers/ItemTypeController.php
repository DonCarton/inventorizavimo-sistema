<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateRequests\UpdateItemTypeRequest;
use App\Http\Resources\ItemTypeResource;
use App\Models\ItemType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use function Termwind\render;

class ItemTypeController extends Controller
{
    public function index(): Response
    {
        $query = ItemType::query();
        $itemTypes = $query->paginate(10)->onEachSide(1);
        return Inertia::render('ItemTypes/Index',[
            'itemTypes' => ItemTypeResource::collection($itemTypes),
            'success' => session('success')
        ]);
    }

    public  function create(): Response
    {
        return Inertia::render('ItemTypes/Create');
    }

    public function show(ItemType $itemType): Response
    {
        return Inertia::render('ItemTypes/Show', [
            'itemType' => new ItemTypeResource($itemType)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'change_acc_amount' => 'required|boolean'
        ]);
        ItemType::create($data);
        return redirect()->route('itemTypes.index')->with('success', 'New item type '. $request['name'].' has been created successfully.');
    }

    public function edit(ItemType $itemType): Response
    {
        return Inertia::render('ItemTypes/Edit',[
            'itemType' => new ItemTypeResource($itemType)
        ]);
    }/**
 * Update the specified resource in storage.
 */
    public function update(UpdateItemTypeRequest $request, ItemType $itemType): RedirectResponse
    {
        $data = $request->validated();
        $itemType->update($data);
        return Redirect::route('itemTypes.index')->with('success',(__('actions.updated').'.'));
    }
}
