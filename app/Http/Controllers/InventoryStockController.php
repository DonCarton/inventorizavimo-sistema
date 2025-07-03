<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreRequests\AdjustInventoryAmountViaLog;
use App\Models\AmountLog;
use App\Models\InventoryStock;
use App\Models\InventoryItem;
use Illuminate\Http\RedirectResponse;

class InventoryStockController extends Controller
{

    public function store(Request $request)
    {
        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'facility_id' => 'required|exists:facilities,id',
            'cupboard' => 'nullable|numeric',
            'shelf' => 'nullable|string',
            'total_amount' => 'required|numeric|min:0',
            'created_by' => '',
            'updated_by' => '',
        ]);

        InventoryStock::updateOrCreate(
            [
                'inventory_item_id' => $validated['inventory_item_id'],
                'facility_id' => $validated['facility_id'],
            ],
            [
                'total_amount' => $validated['total_amount'],
            ]
        );
        
        return redirect()->back()->with("success",__("actions.inventoryStock.created"));
    }
    
    public function update(Request $request, InventoryStock $inventoryStock)
    {
        $inventoryItem = $inventoryStock->inventoryItem;
        
        if ($inventoryItem->itemType->change_acc_amount)
        {
            $validated = $request->validate([
                    'total_amount' => 'required|numeric|min:0'
            ]);
            $inventoryStock->update(['total_amount' => $validated['total_amount']]);
            return back()->with("success",__("actions.inventoryStock.updated"));
        }
        
        return back()->with("failure","This action is not permitted for this item!");
    }

    public function takeOutAmountLog(AdjustInventoryAmountViaLog $request, InventoryItem $inventoryItem): RedirectResponse
    {
        $queryParams = $request->query('query');
        $request->validated();
        if ($request->action === 'remove') {
            $request->validate([
                'amount' => [
                    'lte:total_available'
                ]
            ]);
        }
        $facilityId = $request->input('facility_id');
        if ($request->action === 'return') {
            $amountInLaboratory = AmountLog::where('inventory_item_id', $inventoryItem->id)
                ->where('facility_id', $facilityId)
                ->where('action', 'remove')
                ->sum('amount');
            $amountreturned = AmountLog::where('inventory_item_id', $inventoryItem->id)
                ->where('facility_id', $facilityId)
                ->where('action', 'return')
                ->sum('amount');
            $availableInLaboratory = $amountInLaboratory - $amountreturned;
            if ($request->amount > $availableInLaboratory) {
                return back()->withErrors(['amount' => __("actions.inventoryItem.volumeMismatch")]);
            }
        }
        AmountLog::create([
            'inventory_item_id' => $inventoryItem->id,
            'facility_id' => $request->input('facility_id'),
            'action' => $request->input('action'),
            'amount' => $request->input('amount'),
            'comment' => $request->input('comment'),
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);
        $totalTakenInFacility = AmountLog::where('inventory_item_id', $inventoryItem->id)
            ->where('facility_id', $facilityId)
            ->where('action', 'remove')
            ->sum('amount');
        $totalReturnedInFacility = AmountLog::where('inventory_item_id', $inventoryItem->id)
            ->where('facility_id', $facilityId)
            ->where('action', 'return')
            ->sum('amount');
        if ($totalTakenInFacility == $totalReturnedInFacility) {
            AmountLog::where('inventory_item_id', $inventoryItem->id)
                ->where('facility_id', $facilityId)
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
}
