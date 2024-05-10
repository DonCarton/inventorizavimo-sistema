<?php

namespace App\Http\Controllers;

use App\Exports\InventoryExports;
use App\Http\Requests\ChangeAmountInventoryItemRequest;
use App\Http\Requests\StoreInventoryItemRequest;
use App\Http\Requests\UpdateInventoryItemRequest;
use App\Http\Resources\CRUDInventoryItemResource;
use App\Http\Resources\InventoryItemResource;
use App\Models\InventoryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class InventoryItemsController extends Controller
{
    public function index(): Response
    {
        $query = InventoryItem::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');

        if (request('local_name')){
            $query->where('local_name','like','%'.request('local_name').'%');
        }
        if (request('name')){
            $query->where('name','like','%'.request('name').'%');
        }
        if (request('updated_by')){
        $query->where('updated_by','like','%'.request('updated_by').'%');
        }

        $inventoryItems = $query->orderBy($sortField, $sortDirection)->paginate(3)->onEachSide(1);
        return Inertia::render('Inventory/Index', [
            'inventoryItems' => InventoryItemResource::collection($inventoryItems),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function fetchPostNumber(Request $request): JsonResponse
    {
        $prefixOptionId = $request->input('prefix_option_id');
        $prefixOptionIdToFetch = $prefixOptionId . '%';
        $latestPost = InventoryItem::where('local_name', 'like', $prefixOptionIdToFetch)->latest()->first();
        if ($latestPost == null) {
            $newIdentifier = $prefixOptionId . '-001';
            return response()->json(['post_number' => $newIdentifier]);
        }
        $numericPart = (int)preg_replace('/[^0-9]/', '', $latestPost->local_name);
        $numericPart++;
        $newIdentifier = $prefixOptionId . str_pad($numericPart, 3, '0', STR_PAD_LEFT) . '-P';
        return response()->json(['post_number' => $newIdentifier]);
    }

    public function generateUniqueIdentifier(Request $request): JsonResponse
    {
        $prefixOptionId = $request->input('prefix_option_id');
        $prefixOptionIdToFetch = $prefixOptionId . '%';
        $latestItem = InventoryItem::where('local_name', 'like', $prefixOptionIdToFetch)->latest()->first();
        if ($latestItem == null) {
            $newIdentifier = $prefixOptionId . '-001';
            return response()->json(['post_number' => $newIdentifier]);
        }
        preg_match('/(\d+)-([KPB])/', $latestItem, $matches);
        $numericPart = isset($matches[1]) ? (int)$matches[1] : 0;
        $suffix = $matches[2] ?? 'K';

        if ($numericPart < 999) {
            $numericPart++;
        } else {
            $numericPart = 1;
            $suffix = $this->getNextSuffix($suffix);
        }

        $newIdentifier = $prefixOptionId . str_pad($numericPart, 3, '0', STR_PAD_LEFT) . "-$suffix";
        return response()->json(['post_number' => $newIdentifier]);
    }

    private function getNextSuffix($currentSuffix): string
    {
        $suffixes = ['K', 'P', 'B'];
        $currentIndex = array_search($currentSuffix, $suffixes);
        $nextIndex = ($currentIndex + 1) % count($suffixes);
        return $suffixes[$nextIndex];
    }

    public function create(): Response
    {
        return Inertia::render('Inventory/Create');
    }

    public function store(StoreInventoryItemRequest $request): RedirectResponse
    {
        dd($request);
        $data = $request->validated();
        InventoryItem::create($data);
        return to_route('inventoryItems.index');
    }

    public function update(UpdateInventoryItemRequest $request, InventoryItem $inventoryItem): RedirectResponse
    {
        $data = $request->validated();
        $inventoryItem->update($data);
        return Redirect::route('inventoryItems.index');
    }

    public function updateAmount(ChangeAmountInventoryItemRequest $request, InventoryItem $inventoryItem): RedirectResponse
    {
        if ($request['amount_removed'] > 0) {
            $data = $request->validate([
                'amount_removed' => 'numeric|lt:total_amount',
                'total_amount' => 'numeric',
            ]);
            $data['total_amount'] = $data['total_amount'] - $data['amount_removed'];
        } else {
            $data = $request->only(['amount_added', 'total_amount']);
            $data['total_amount'] = $data['total_amount'] + $data['amount_added'];
        }
        $inventoryItem->update(['total_count' => $data['total_amount']]);
        return Redirect::route('inventoryItems.edit', $inventoryItem);
    }

    public function edit(InventoryItem $inventoryItem): Response
    {
        return Inertia::render('Inventory/Edit', [
            'inventoryItem' => new InventoryItemResource($inventoryItem)
        ]);
    }

    public function editAmount(InventoryItem $inventoryItem): Response
    {
//        $inventoryItem = InventoryItems::findOrFail($id);
        return Inertia::render('User/Edit', [
            'inventoryItem' => new CRUDInventoryItemResource($inventoryItem)
        ]);
    }

    public function export(): BinaryFileResponse
    {
        return Excel::download(new InventoryExports(), 'inventory.xlsx');
    }
}
