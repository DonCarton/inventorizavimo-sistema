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
use Carbon\Carbon;
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
    /**
     * @return Response
     */
    public function index(): Response
    {
        $query = InventoryItem::query();//->orderByRaw("CASE WHEN total_count < critical_amount THEN 0 ELSE 1 END");
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');
        if (request('local_name')) {
            $query->where('local_name', 'like', '%' . request('local_name') . '%');
        }
        if (request('name')) {
            $query->where('name', 'like', '%' . request('name') . '%');
        }
        if (request('name_eng')) {
            $query->where('name_eng', 'like', '%' . request('name_eng') . '%');
        }
        if (request('inventory_type')) {
            $query->whereHas('itemType', function ($query) {
               $query->where('name', 'like', '%' . request('inventory_type') . '%');
            });
        }
        if (request('laboratory')) {
            $query->whereHas('belongsToLaboratory', function ($query) {
               $query->where('name', 'like', '%' . request('laboratory') . '%');
            });
        }
        if (request('updated_by')) {
            $query->whereHas('updatedBy', function ($query) {
               $query->where('email', 'like', '%' . request('updated_by') . '%');
            });
        }
        $inventoryItems = $query
            ->orderBy($sortField, $sortDirection)->paginate(50)
            ->withQueryString()->onEachSide(1);
        return Inertia::render('Inventory/Index', [
            'inventoryItems' => InventoryItemIndexResource::collection($inventoryItems),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'failure' => session('failure')
        ]);
    }

    public function userOwnInventory(): Response
    {
        $query = InventoryItem::query()->where('laboratory', auth()->user()->laboratory);
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');
        if (request('local_name')) {
            $query->where('local_name', 'like', '%' . request('local_name') . '%');
        }
        if (request('name')) {
            $query->where('name', 'like', '%' . request('name') . '%');
        }
        if (request('name_eng')) {
            $query->where('name_eng', 'like', '%' . request('name_eng') . '%');
        }
        if (request('inventory_type')) {
            $query->whereHas('itemType', function ($query) {
                $query->where('name', 'like', '%' . request('inventory_type') . '%');
            });
        }
        if (request('updated_by')) {
            $query->whereHas('updatedBy', function ($query) {
                $query->where('email', 'like', '%' . request('updated_by') . '%');
            });
        }
        $inventoryItems = $query
            ->orderBy($sortField, $sortDirection)->paginate(50)
            ->withQueryString()->onEachSide(1);
        return Inertia::render('User/MyInventory', [
            'inventoryItems' => InventoryItemIndexResource::collection($inventoryItems),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'failure' => session('failure')
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
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

    /**
     * @return Response
     */
    public function create(): Response
    {
        $laboratories = Laboratory::query()->get();
        $itemTypes = ItemType::query()->get();
        return Inertia::render('Inventory/Create', [
            'laboratories' => LaboratoryResourceForMulti::collection($laboratories),
            'itemTypes' => ItemTypeForSelect::collection($itemTypes)
        ]);
    }

    /**
     * @param StoreInventoryItemRequest $request
     * @return RedirectResponse
     */
    public function store(StoreInventoryItemRequest $request): RedirectResponse
    {
        InventoryItem::create($request->all());
        return to_route('inventoryItems.index')->with('success', __('actions.inventoryItem.created', ['local_name' => $request['local_name']]) . '.');
    }

    /**
     * @param InventoryItem $inventoryItem
     * @return Response
     */
    public function editRaw(InventoryItem $inventoryItem): Response
    {
        $amountLogs = $inventoryItem->amountLogs;
        $laboratories = Laboratory::query()->get()->all();
        $itemTypes = ItemType::query()->get();
        return Inertia::render('Inventory/Edit', [
            'inventoryItem' => new InventoryItemResource($inventoryItem),
            'logsForItem' => AmountLogResource::collection($amountLogs),
            'laboratories' => LaboratoryResourceForMulti::collection($laboratories),
            'itemTypes' => ItemTypeForSelect::collection($itemTypes)
        ]);

    }

    /**
     * @param UpdateInventoryItemRequest $request
     * @param InventoryItem $inventoryItem
     * @return RedirectResponse
     */
    public function update(UpdateInventoryItemRequest $request, InventoryItem $inventoryItem): RedirectResponse
    {
        $originalData = $inventoryItem->toArray();
        $validatedData = $request->validated();
        $extraData = $request->except(array_keys($validatedData));
        $data = array_merge($validatedData, $extraData);
        $inventoryItem->update($data);
        $changedData = array_diff_assoc($data, $originalData);
        if (!empty($changedData)){
            return Redirect::route('inventoryItems.index')->with('success', __('actions.inventoryItem.updated', ['local_name' => $data['local_name']]) . '.');
        }
        return Redirect::route('inventoryItems.index');
    }

    /**
     * @param ChangeAmountInventoryItemRequest $request
     * @param InventoryItem $inventoryItem
     * @return RedirectResponse
     */
    public function updateAmount(ChangeAmountInventoryItemRequest $request, InventoryItem $inventoryItem): RedirectResponse
    {
        if ($request['amount_removed'] > 0) {
            $data = $request->validate([
                'amount_removed' => 'numeric|lt:total_amount',
                'total_amount' => 'numeric',
                'updated_by' => 'required'
            ]);
            $data['total_amount'] = $data['total_amount'] - $data['amount_removed'];
        } else {
            $data = $request->only(['amount_added', 'total_amount', 'updated_by']);
            $data['total_amount'] = $data['total_amount'] + $data['amount_added'];
        }
        $inventoryItem->update([
            'total_amount' => $data['total_amount'],
            'updated_by' => $data['updated_by']
        ]);
        if ($inventoryItem['total_count'] <= $inventoryItem['critical_amount'] && $request['amount_removed']) {
            event(new AmountRunningLow($inventoryItem, $request['urlToRedirect']));
        }
        if ($request['urlToRedirect']){
            return to_route('reader')
                ->with('success', __('actions.inventoryItem.updated', [
                            'local_name' => $inventoryItem->local_name]
                    ) . '.');
        }
        else {
            return to_route('inventoryItems.index')
                ->with('success', __('actions.inventoryItem.updated', [
                            'local_name' => $inventoryItem->local_name]
                    ) . '.');
        }
    }

    /**
     * @param InventoryItem $inventoryItem
     * @return Response
     */
    public function edit(InventoryItem $inventoryItem): Response
    {
        $redirectToReader = false;
        if (request('urlForReader')) { $redirectToReader = true; }
        $laboratories = Laboratory::query()->whereNotIn('id',[$inventoryItem->laboratory])->get();
        $itemTypes = ItemType::query()->get();
        if ($inventoryItem->itemType->change_acc_amount) {
            return Inertia::render('User/Edit', [
                'inventoryItem' => new CRUDInventoryItemResource($inventoryItem),
                'laboratories' => LaboratoryResourceForMulti::collection($laboratories),
                'itemTypes' => ItemTypeForSelect::collection($itemTypes),
                'redirectToReader' => $redirectToReader
            ]);
        } else {
            $amountLogs = $inventoryItem->amountLogs;
            $totalTaken = AmountLog::where('inventory_item_id', $inventoryItem->id)->where('action', 'REMOVE')->sum('amount');
            $totalReturned = AmountLog::where('inventory_item_id', $inventoryItem->id)->where('action', 'RETURN')->sum('amount');
            return Inertia::render('User/EditLog', [
                'inventoryItem' => new CRUDInventoryItemResource($inventoryItem),
                'logsForItem' => AmountLogResource::collection($amountLogs),
                'totalInUse' => $inventoryItem->total_amount - $totalTaken + $totalReturned,
                'laboratories' => LaboratoryResource::collection($laboratories),
                'previousUrl' => url()->previous(),
                'redirectToReader' => $redirectToReader
            ]);
        }
    }

    /**
     * @param AdjustInventoryAmountViaLog $request
     * @param InventoryItem $inventoryItem
     * @return RedirectResponse
     */
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
                return back()->withErrors(['amount' => __("actions.inventoryItem.volumeMismatch")]);
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
        if ($request->urlToRedirect) {
            return redirect()->route('reader')
                ->with('success', __('actions.inventoryItem.logged',['local_name' => $inventoryItem->local_name]) . '.');
        } else {
            return redirect()->route('inventoryItems.index')
                ->with('success', __('actions.inventoryItem.logged',['local_name' => $inventoryItem->local_name]) . '.');
        }
    }

    /**
     * @param InventoryItem $inventoryItem
     * @return Response
     */
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

    /**
     * @param int $id
     * @return RedirectResponse
     */
    public function destroy(int $id): RedirectResponse
    {
        $inventoryItem = InventoryItem::findOrFail($id);
        $logs = $inventoryItem->amountLogs;
        if (!$logs->isEmpty()){
            return redirect()->route('inventoryItems.index')->with('failure',__('inventory_item.logBound'));
        }
        $inventoryItem->delete();
        return redirect()->route('inventoryItems.index')
            ->with('success', __('actions.inventoryItem.deleted', ['local_name' => $inventoryItem['local_name']]) . '.');
    }

    /**
     * @return BinaryFileResponse
     */
    public function export(): BinaryFileResponse
    {
        $data = request()->query();
        $dateTimeNow = Carbon::now()->toDateTimeString();
        return Excel::download(new InventoryExports($data), $dateTimeNow . '_inventory.xlsx');
    }

    /**
     * @param Request $request
     * @return RedirectResponse
     */
    public function import(Request $request): RedirectResponse
    {
        $file = $request->file('file');
        $fileName = $request->file('file')->getClientOriginalName();
        Excel::import(new InventoryImport(), $file);
        return to_route('inventoryItems.index')->with('success', __('actions.uploaded', ['name' => $fileName]) . '.');
    }
}
