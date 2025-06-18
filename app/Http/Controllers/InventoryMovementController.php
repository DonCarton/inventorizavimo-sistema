<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InventoryMovement;
use Illuminate\Http\RedirectResponse;

class InventoryMovementController extends Controller
{
	public function store(Request $request)
	{
		$validated = $request->validate([
			'inventory_item_id' => 'required|exists:inventory_items,id',
			'source_facility_id' => 'required|exists:facilities,id',
			'target_facility_id' => 'nullable|exists:facilities,id',
			'total_amount_changed' => 'required|numeric|not_in:0',
			'action' => 'required|in:add,remove,transfer',
			'comment' => 'nullable|string|max:500',
		]);

		// Apply stock logic
		InventoryMovement::create([
			'inventory_item_id' => $validated['inventory_item_id'],
			'source_facility_id' => $validated['source_facility_id'],
			'target_facility_id' => $validated['target_facility_id'],
			'total_amount_changed' => $validated['total_amount_changed'],
			'action' => $validated['action'],
			'comment' => $validated['comment'],
			'created_by' => auth()->id(),
			'updated_by' => auth()->id(),
		]);

		// Adjust inventory_stocks accordingly here or via observer/service
		return back()->with("success", __("actions.inventoryMovement.created"));
	}
}
