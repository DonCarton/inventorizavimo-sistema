<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Exports\InventoryExports;
use App\Http\Requests\ExportRequests\InventoryItemExportRequest;
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
use App\Rules\NonNegativeAmount;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
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
        Gate::authorize('viewAny', InventoryItem::class);
        $query = InventoryItem::query();
        $sortField = request("sort_field", 'updated_at');
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
            $query->where('inventory_type', '=', request('inventory_type'));
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
            ->orderByRaw('total_amount <= critical_amount DESC')
            ->orderBy($sortField, $sortDirection)
            ->paginate(50)
            ->withQueryString()->onEachSide(1);

        $itemTypes = ItemType::query()->get();

        return Inertia::render('Inventory/Index', [
            'inventoryItems' => InventoryItemIndexResource::collection($inventoryItems),
            'itemTypes' => ItemTypeForSelect::collection($itemTypes),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'failure' => session('failure')
        ]);
    }

    public function userOwnInventory(): Response
    {
        $query = InventoryItem::query()->where('laboratory', auth()->user()->laboratory);
        $sortField = request("sort_field", 'updated_at');
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
            $query->where('inventory_type', '=', request('inventory_type'));
        }
        if (request('updated_by')) {
            $query->whereHas('updatedBy', function ($query) {
                $query->where('email', 'like', '%' . request('updated_by') . '%');
            });
        }
        $inventoryItems = $query
            ->orderByRaw('total_amount <= critical_amount DESC')
            ->orderBy($sortField, $sortDirection)
            ->paginate(50)
            ->withQueryString()->onEachSide(1);

        $itemTypes = ItemType::query()->get();

        return Inertia::render('User/MyLaboratory', [
            'inventoryItems' => InventoryItemIndexResource::collection($inventoryItems),
            'itemTypes' => ItemTypeForSelect::collection($itemTypes),
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

        $existingPosts = InventoryItem::where('local_name', 'like', $prefixOptionIdToFetch)
            ->orderBy('local_name')
            ->pluck('local_name')
            ->toArray();

        $numericParts = array_map(function($localName) use ($prefixOptionId) {
            return (int) str_replace($prefixOptionId, '', $localName);
        }, $existingPosts);

        sort($numericParts);
        $newNumericPart = 1;

        foreach ($numericParts as $part) {
            if ($part != $newNumericPart) {
                break;
            }
            $newNumericPart++;
        }

        $newIdentifier = $prefixOptionId . str_pad($newNumericPart, 3, '0', STR_PAD_LEFT);

        return response()->json(['post_number' => $newIdentifier]);
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function create(Request $request): Response
    {
        Gate::authorize('create', InventoryItem::class);
        $queryParams = $request->query();
        $laboratories = Laboratory::query()->get();
        $itemTypes = ItemType::query()->get();
        return Inertia::render('Inventory/Create', [
            'laboratories' => LaboratoryResourceForMulti::collection($laboratories),
            'itemTypes' => ItemTypeForSelect::collection($itemTypes),
            'referrer' => $request->query('referrer'),
            'queryParams' => $request->query('query')
        ]);
    }

    /**
     * @param StoreInventoryItemRequest $request
     * @return RedirectResponse
     */
    public function store(StoreInventoryItemRequest $request): RedirectResponse
    {
        $queryParams = $request->query('query');
        $redirectDestination = $request->query('referrer', 'index');
        Gate::authorize('create', InventoryItem::class);
        InventoryItem::create($request->all());
        return to_route("inventoryItems.${redirectDestination}", $queryParams)->with('success', __('actions.inventoryItem.created', ['local_name' => $request['local_name']]));
    }

    /**
     * @param int|string $identifier
     * @param Request $request
     * @return Response
     */
    public function editRaw(int|string $identifier, Request $request): Response
    {
        $inventoryItem = InventoryItem::where('id','=',$identifier)->orWhere('local_name', $identifier)->firstOrFail();
        Gate::authorize('edit',$inventoryItem);
        $amountLogs = $inventoryItem->amountLogs;
        $laboratories = Laboratory::query()->get()->all();
        $itemTypes = ItemType::query()->get();
        $queryParams = $request->query('query');
        return Inertia::render('Inventory/Edit', [
            'inventoryItem' => new InventoryItemResource($inventoryItem),
            'logsForItem' => AmountLogResource::collection($amountLogs),
            'laboratories' => LaboratoryResourceForMulti::collection($laboratories),
            'itemTypes' => ItemTypeForSelect::collection($itemTypes),
            'queryParams' => $queryParams,
            'referrer' => $request->query('referrer'),
            'can' => [
                'alterType' => $request->user()->hasRole(RoleEnum::SUPER_ADMIN),
                'alterLocation' => $request->user()->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN]),
                'delete' => $request->user()->can('delete',$inventoryItem),
            ]
        ]);

    }

    /**
     * @param UpdateInventoryItemRequest $request
     * @param InventoryItem $inventoryItem
     * @return RedirectResponse
     */
    public function update(UpdateInventoryItemRequest $request, InventoryItem $inventoryItem): RedirectResponse
    {
        $queryParams = $request->query('query');
        $originalData = $inventoryItem->toArray();
        $validatedData = $request->validated();
        $extraData = $request->except(array_keys($validatedData));
        $data = array_merge($validatedData, $extraData);
        $inventoryItem->update($data);
        unset($data['query'],$data['referrer']);
        $changedData = array_diff_assoc($data, $originalData);

        $redirectDestination = $request->query('referrer', 'index');

        if (!empty($changedData)){
            return Redirect::route("inventoryItems.${redirectDestination}", $queryParams)->with('success', __('actions.inventoryItem.updated', ['local_name' => $data['local_name']]));
        }
        return Redirect::route("inventoryItems.${redirectDestination}", $queryParams);
    }

    /**
     * @param ChangeAmountInventoryItemRequest $request
     * @param InventoryItem $inventoryItem
     * @return RedirectResponse
     */
    public function updateAmount(ChangeAmountInventoryItemRequest $request, InventoryItem $inventoryItem): RedirectResponse
    {
        $queryParams = $request->query('query');
        $redirectDestination = $request->query('referrer', 'index');
        if ($request['amount_removed'] > 0) {
            $data = $request->validate([
                'amount_removed' => ['numeric', new NonNegativeAmount($inventoryItem->total_amount)],
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
        if ($request['urlToRedirect']){
            return to_route('reader')
                ->with('success', __('actions.inventoryItem.updated', [
                            'local_name' => $inventoryItem->local_name]
                    ));
        }
        else {
            return to_route("inventoryItems.${redirectDestination}", $queryParams)
                ->with('success', __('actions.inventoryItem.updated', [
                            'local_name' => $inventoryItem->local_name]
                    ));
        }
    }

    /**
     * @param Request $request
     * @param int|string $identifier
     * @return Response
     */
    public function edit(Request $request, int|string $identifier): Response
    {
        $inventoryItem = InventoryItem::where('id','=',$identifier)->orWhere('local_name', $identifier)->firstOrFail();
        $redirectToReader = false;
        $queryParams = $request->query('query');
        if (request('urlForReader')) { $redirectToReader = true; }
        $laboratories = Laboratory::query()->whereNotIn('id',[$inventoryItem->laboratory])->get();
        $itemTypes = ItemType::query()->get();
        if ($inventoryItem->itemType->change_acc_amount) {
            return Inertia::render('User/Edit', [
                'inventoryItem' => new CRUDInventoryItemResource($inventoryItem),
                'laboratories' => LaboratoryResourceForMulti::collection($laboratories),
                'itemTypes' => ItemTypeForSelect::collection($itemTypes),
                'redirectToReader' => $redirectToReader,
                'queryParams' => $queryParams,
                'referrer' => $request->query('referrer'),
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
                'redirectToReader' => $redirectToReader,
                'queryParams' => $queryParams,
                'referrer' => $request->query('referrer'),
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
        $queryParams = $request->query('query');
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
                ->with('success', __('actions.inventoryItem.logged',['local_name' => $inventoryItem->local_name]));
        } else {
            $redirectTo = $request->query('referrer', 'index');
            return redirect()->route("inventoryItems.${redirectTo}",$queryParams)
                ->with('success', __('actions.inventoryItem.logged',['local_name' => $inventoryItem->local_name]));
        }
    }

    /**
     * @param Request $request
     * @param int|string $identifier
     * @return Response
     */
    public function show(Request $request, int|string $identifier): Response
    {
        $inventoryItem = InventoryItem::where('id','=',$identifier)->orWhere('local_name', $identifier)->firstOrFail();
        $laboratories = Laboratory::query()->get()->all();
        $itemTypes = ItemType::query()->get();
        $queryParams = $request->query('query');
        return Inertia::render('Inventory/Show', [
            'inventoryItem' => new InventoryItemResource($inventoryItem),
            'laboratories' => LaboratoryResourceForMulti::collection($laboratories),
            'itemTypes' => ItemTypeForSelect::collection($itemTypes),
            'queryParams' => $queryParams,
            'referrer' => $request->query('referrer')
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
            return redirect()->route('inventoryItems.index')->with('failure',__('model_attributes.inventory_item.logBound'));
        }
        $inventoryItem->delete();
        return redirect()->route('inventoryItems.index')
            ->with('success', __('actions.inventoryItem.deleted', ['local_name' => $inventoryItem['local_name']]));
    }

    /**
     * @param InventoryItemExportRequest $exportRequest
     * @return BinaryFileResponse
     */
    public function export(InventoryItemExportRequest $exportRequest): BinaryFileResponse
    {
        $validateData = $exportRequest->validated();
        if (str_ends_with($exportRequest->url(),'myLaboratory')) {
            $validateData['laboratory'] = auth()->user()->laboratory;
        }
        $dateTimeNow = Carbon::now('Europe/Vilnius')->toDateTimeString();
        return Excel::download(new InventoryExports($validateData), $dateTimeNow . '_inventory_export.xlsx');
    }

    /**
     * @param Request $request
     * @return RedirectResponse
     */
    public function import(Request $request): RedirectResponse
    {
        $referrer = $request['referrer'] ?? 'index';
        $file = $request->file('file');
        $fileName = $request->file('file')->getClientOriginalName();
        Excel::import(new InventoryImport(), $file);
        return to_route("inventoryItems.${referrer}")->with('success', __('actions.uploaded', ['name' => $fileName]));
    }
}
