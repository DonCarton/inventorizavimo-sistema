<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRequests\StoreItemTypeRequest;
use App\Http\Requests\UpdateRequests\UpdateItemTypeRequest;
use App\Http\Resources\ItemTypeResource;
use App\Models\ItemType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use function Termwind\render;

class ItemTypeController extends Controller
{
    /**
     * Pateikti puslapį, kuriame yra pateikiami visi inventoriaus tipai.
     * Objektai yra dalinami į puslapius po 10 įrašų kievkiename puslapyje.
     * @return Response
     */
    public function index(): Response
    {
        $query = ItemType::query();
        $itemTypes = $query->paginate(10)->onEachSide(1);
        return Inertia::render('ItemTypes/Index',[
            'itemTypes' => ItemTypeResource::collection($itemTypes),
            'success' => session('success'),
            'warning' => session('warning'),
        ]);
    }

    /**
     * Pateikti formą, kurioje galime suvesti visus reikiamus/norimus laukus kuriant naują objektą
     * @return Response
     */
    public  function create(): Response
    {
        return Inertia::render('ItemTypes/Create');
    }

    /**
     * Pateikti formą, kurioje galime peržvelgti objektą neleidžiant redaguoti jokių laukų.
     * @param ItemType $itemType
     * @return Response
     */
    public function show(ItemType $itemType): Response
    {
        return Inertia::render('ItemTypes/Show', [
            'itemType' => new ItemTypeResource($itemType)
        ]);
    }

    /**
     * Išsaugoti naujai sukurtą įrašą sistemoje.
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(StoreItemTypeRequest $request): RedirectResponse
    {
        $data = $request->validated();
        ItemType::create($data);
        return redirect()->route('itemTypes.index')->with('success',(__('actions.itemType.created', ['name' => $request['name']]) . '.'));
    }

    /**
     * Pateikti formą, kurioje galime redaguoti užkrautą objektą.
     * @param ItemType $itemType
     * @return Response
     */
    public function edit(ItemType $itemType): Response
    {
        return Inertia::render('ItemTypes/Edit',[
            'itemType' => new ItemTypeResource($itemType)
        ]);
    }

    /**
     * Atnaujinti egzistuojantį objektą su nauja informacija.
     * @param UpdateItemTypeRequest $request
     * @param ItemType $itemType
     * @return RedirectResponse
     */
    public function update(UpdateItemTypeRequest $request, ItemType $itemType): RedirectResponse
    {
        $data = $request->validated();
        $itemType->update($data);
        return Redirect::route('itemTypes.index')->with('success',(__('actions.itemType.updated', ['name' => $data['name']]) . '.'));
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $itemType = ItemType::findOrFail($id);
        Gate::authorize('delete',$itemType);
        return to_route('itemTypes.index')->with('warning',(__('actions.itemType.deleted', ['name' => $itemType['name']]).'.'));
    }
}
