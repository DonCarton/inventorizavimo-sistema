<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemTypeResource;
use App\Models\ItemType;
use Illuminate\Http\RedirectResponse;
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
            'itemTypes' => ItemTypeResource::collection($itemTypes),
            'success' => session('success')
        ]);
    }

    public  function create(): Response
    {
        return Inertia::render('ItemTypes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $data['change_acc_amount'] = 0;
        $data['created_by'] = auth()->user()->id;
        $data['updated_by'] = auth()->user()->id;
        ItemType::create($data);
        return redirect()->route('itemTypes.index')->with('success', 'New item type '. $request['name'].' has been created successfully.');
    }

    public function edit(ItemType $itemType): Response
    {
        return Inertia::render('ItemTypes/Edit',[
            'itemType' => new ItemTypeResource($itemType)
        ]);
    }
}
