<?php

namespace App\Http\Controllers;

use App\Exports\InventoryExports;
use App\Http\Requests\StoreInventoryItemRequest;
use App\Http\Requests\UpdateInventoryItemRequest;
use App\Http\Resources\InventoryItemsResource;
use App\Models\InventoryItems;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

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
    public function fetchPostNumber(Request $request): JsonResponse
    {
        $prefixOptionId = $request->input('prefix_option_id');
        $prefixOptionIdToFetch = $prefixOptionId.'%';
        $latestPost = InventoryItems::where('local_name','like',$prefixOptionIdToFetch)->latest()->first();
        if($latestPost == null){
            $newIdentifier = $prefixOptionId.'-001';
            return response()->json(['post_number' => $newIdentifier]);
        }
        $numericPart = (int) preg_replace('/[^0-9]/', '', $latestPost->local_name);
        $numericPart++;
        $newIdentifier = $prefixOptionId . str_pad($numericPart, 3, '0', STR_PAD_LEFT) . '-P';
        return response()->json(['post_number' => $newIdentifier]);
    }
    public function generateUniqueIdentifier(Request $request): JsonResponse
    {
        $prefixOptionId = $request->input('prefix_option_id');
        $prefixOptionIdToFetch = $prefixOptionId.'%';
        $latestItem = InventoryItems::where('local_name','like',$prefixOptionIdToFetch)->latest()->first();
        if ($latestItem == null){
            $newIdentifier = $prefixOptionId.'-001';
            return response()->json(['post_number' => $newIdentifier]);
        }
        preg_match('/(\d+)-([KPB])/', $latestItem, $matches);
        $numericPart = isset($matches[1]) ? (int) $matches[1] : 0;
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
        $data = $request->validated();
        InventoryItems::create($data);
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
    public function export(): BinaryFileResponse
    {
        return Excel::download(new InventoryExports(), 'inventory.xlsx');
    }
}
