<?php

namespace App\Http\Controllers;

use App\Events\AmountRunningLow;
use App\Exports\InventoryExports;
use App\Http\Requests\StoreRequests\AdjustInventoryAmountViaLog;
use App\Http\Requests\StoreRequests\StoreInventoryItemRequest;
use App\Http\Requests\UpdateRequests\ChangeAmountInventoryItemRequest;
use App\Http\Requests\UpdateRequests\UpdateInventoryItemRequest;
use App\Http\Resources\AmountLogResource;
use App\Http\Resources\CRUDInventoryItemResource;
use App\Http\Resources\IndexResources\InventoryItemIndexResource;
use App\Http\Resources\InventoryItemResource;
use App\Http\Resources\LaboratoryResource;
use App\Http\Resources\SelectObjectResources\ItemTypeForSelect;
use App\Http\Resources\SelectObjectResources\LaboratoryResourceForMulti;
use App\Imports\InventoryImport;
use App\Models\AmountLog;
use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Laboratory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class InventoryItemController extends Controller
{
    public function index(): Response
    {
        $query = InventoryItem::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');
        if (request('local_name')) {
            $query->where('local_name', 'like', '%' . request('local_name') . '%');
        }
        if (request('name')) {
            $query->where('name', 'like', '%' . request('name') . '%');
        }
        if (request('updated_by')) {
            $query->whereHas('createdBy', function ($query) {
                $query->where('email', 'like', '%' . request('updated_by') . '%');
            });
        }
        $inventoryItems = $query->orderBy($sortField, $sortDirection)->paginate(10)->withQueryString()->onEachSide(1);
        return Inertia::render('Inventory/Index', [
            'inventoryItems' => InventoryItemIndexResource::collection($inventoryItems),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'failure' => session('failure')
        ]);
    }

    public function fetchPostNumber(Request $request): JsonResponse
    {
        $prefixOptionId = $request->input('prefix_option_id');
        $prefixOptionIdToFetch = $prefixOptionId . '%';
        $latestPost = InventoryItem::where('local_name', 'like', $prefixOptionIdToFetch)->latest()->first();
        if ($latestPost == null) {
            $newIdentifier = $prefixOptionId . '001';
            return response()->json(['post_number' => $newIdentifier]);
        }
        $numericPart = (int)preg_replace('/[^0-9]/', '', $latestPost->local_name);
        if ($numericPart < 999) {
            $numericPart++;
        } else {
            $numericPart = 1;
        }
        $newIdentifier = $prefixOptionId . str_pad($numericPart, 3, '0', STR_PAD_LEFT);
        return response()->json(['post_number' => $newIdentifier]);
    }

    public function create(): Response
    {
        $laboratories = Laboratory::query()->get();
        $itemTypes = ItemType::query()->get();
        return Inertia::render('Inventory/Create', [
            'laboratories' => LaboratoryResourceForMulti::collection($laboratories),
            'itemTypes' => ItemTypeForSelect::collection($itemTypes)
        ]);
    }

    public function store(StoreInventoryItemRequest $request): RedirectResponse
    {
        $data = $request->validated();
        InventoryItem::create($request->all());
        return to_route('inventoryItems.index')->with('success', __('actions.created') . ' ' . $data['local_name'] . '.');
    }

    public function editRaw(InventoryItem $inventoryItem): Response
    {
        $laboratories = Laboratory::query()->get()->all();
        $itemTypes = ItemType::query()->get();
        return Inertia::render('Inventory/Edit', [
            'inventoryItem' => new InventoryItemResource($inventoryItem),
            'laboratories' => LaboratoryResourceForMulti::collection($laboratories),
            'itemTypes' => ItemTypeForSelect::collection($itemTypes)
        ]);

    }

    public function update(UpdateInventoryItemRequest $request, InventoryItem $inventoryItem): RedirectResponse
    {
        $originalData = $inventoryItem->toArray();
        $validatedData = $request->validated();
        $extraData = $request->except(array_keys($validatedData));
        $data = array_merge($validatedData, $extraData);
        $inventoryItem->update($data);
        $changedData = array_diff_assoc($data, $originalData);
        if (!empty($changedData)){
            return Redirect::route('inventoryItems.index')->with('success', __('actions.updated') . ' ' . $data['local_name'] . '.');
        }
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
        if ($inventoryItem['total_count'] <= $inventoryItem['critical_amount']) {
            event(new AmountRunningLow($inventoryItem, $request->user()));
        }
        return to_route('inventoryItems.index')->with('success', 'Item was updated');
    }

    public function edit(InventoryItem $inventoryItem): Response
    {
        $laboratories = Laboratory::query()->get();
        $itemTypes = ItemType::query()->get();
        if ($inventoryItem->itemType->change_acc_amount) {
            return Inertia::render('User/Edit', [
                'inventoryItem' => new CRUDInventoryItemResource($inventoryItem),
                'laboratories' => LaboratoryResourceForMulti::collection($laboratories),
                'itemTypes' => ItemTypeForSelect::collection($itemTypes),
            ]);
        } else {
            $amountLogs = $inventoryItem->amountLogs;
            $totalTaken = AmountLog::where('inventory_item_id', $inventoryItem->id)->where('action', 'REMOVE')->sum('amount');
            $totalReturned = AmountLog::where('inventory_item_id', $inventoryItem->id)->where('action', 'RETURN')->sum('amount');
            return Inertia::render('User/EditLog', [
                'inventoryItem' => new CRUDInventoryItemResource($inventoryItem),
                'logsForItem' => AmountLogResource::collection($amountLogs),
                'totalInUse' => $inventoryItem->total_count - $totalTaken + $totalReturned,
                'laboratories' => LaboratoryResource::collection($laboratories),
                'previousUrl' => url()->previous()
            ]);
        }
    }

    public function takeOutAmountLog(AdjustInventoryAmountViaLog $request, InventoryItem $inventoryItem): RedirectResponse
    {
        $request->validated();
        if ($request->action === 'REMOVE') {
            $request->validate([
                'amount' => [
                    'lte:total_available'
                ]
            ]);
        }
        $laboratoryId = $request->input('laboratory_id');
        if ($request->action === 'RETURN') {
            $amountInLaboratory = AmountLog::where('inventory_item_id', $inventoryItem->id)
                ->where('laboratory_id', $laboratoryId)
                ->where('action', 'REMOVE')
                ->sum('amount');
            $amountReturned = AmountLog::where('inventory_item_id', $inventoryItem->id)
                ->where('laboratory_id', $laboratoryId)
                ->where('action', 'RETURN')
                ->sum('amount');
            $availableInLaboratory = $amountInLaboratory - $amountReturned;
            if ($request->amount > $availableInLaboratory) {
                return back()->withErrors(['amount' => 'The specified amount exceeds the amount available in the laboratory.']);
            }
        }
        AmountLog::create([
            'inventory_item_id' => $inventoryItem->id,
            'laboratory_id' => $request->input('laboratory_id'),
            'action' => $request->input('action'),
            'amount' => $request->input('amount'),
            'comment' => $request->input('comment'),
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);
        $totalTakenInLab = AmountLog::where('inventory_item_id', $inventoryItem->id)
            ->where('laboratory_id', $laboratoryId)
            ->where('action', 'REMOVE')
            ->sum('amount');
        $totalReturnedInLab = AmountLog::where('inventory_item_id', $inventoryItem->id)
            ->where('laboratory_id', $laboratoryId)
            ->where('action', 'RETURN')
            ->sum('amount');
        if ($totalTakenInLab == $totalReturnedInLab) {
            AmountLog::where('inventory_item_id', $inventoryItem->id)
                ->where('laboratory_id', $laboratoryId)
                ->delete();
        }
        return redirect()->route('inventoryItems.index')->with('success', 'Item ' . $inventoryItem->local_name . ' was adjusted');
    }

    public function show(InventoryItem $inventoryItem): Response
    {
        $laboratories = Laboratory::query()->get()->all();
        $itemTypes = ItemType::query()->get();
        return Inertia::render('Inventory/Show', [
            'inventoryItem' => new InventoryItemResource($inventoryItem),
            'laboratories' => LaboratoryResourceForMulti::collection($laboratories),
            'itemTypes' => ItemTypeForSelect::collection($itemTypes)
        ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        $inventoryItem = InventoryItem::findOrFail($id);
        $logs = $inventoryItem->amountLogs;
        if ($logs){
            return redirect()->route('inventoryItems.index')->with('failure',__('inventory_item.logBound'));
        }
        $inventoryItem->delete();
        return redirect()->route('inventoryItems.index')
            ->with('success', 'Deleted.');
    }

    public function export(): BinaryFileResponse
    {
        return Excel::download(new InventoryExports(), 'inventory.xlsx');
    }

    public function import(Request $request): RedirectResponse
    {
        $file = $request->file('file');
        Excel::import(new InventoryImport(), $file);
        return to_route('inventoryItems.index')->with('success', 'Uploaded successfully');
    }
}
