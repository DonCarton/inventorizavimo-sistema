<?php

namespace App\Observers;

use App\Events\AmountRunningLow;
use App\Models\InventoryItem;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Support\Facades\Log;

class InventoryItemObserver implements ShouldHandleEventsAfterCommit
{
    /**
     * Handle the InventoryItem "created" event.
     */
    public function created(InventoryItem $inventoryItem): void
    {
        //
    }

    /**
     * Handle the InventoryItem "updated" event.
     * @param InventoryItem $inventoryItem
     * @return void
     */
    public function updated(InventoryItem $inventoryItem): void
    {
        if ($inventoryItem->isDirty('total_amount')){

            $criticalAmount = $inventoryItem->critical_amount;
            if ($inventoryItem->total_amount <= $criticalAmount && is_null($inventoryItem->critical_amount_notified_at)){
                event(new AmountRunningLow($inventoryItem, false));
                $inventoryItem->critical_amount_notified_at = now();
                $inventoryItem->save();
            }
            else if ($inventoryItem->total_amount > $criticalAmount && !is_null($inventoryItem->critical_amount_notified_at)){
                $inventoryItem->critical_amount_notified_at = null;
                $inventoryItem->save();
            }

        }
    }

    /**
     * Handle the InventoryItem "deleted" event.
     */
    public function deleted(InventoryItem $inventoryItem): void
    {
        //
    }

    /**
     * Handle the InventoryItem "restored" event.
     */
    public function restored(InventoryItem $inventoryItem): void
    {
        //
    }

    /**
     * Handle the InventoryItem "force deleted" event.
     */
    public function forceDeleted(InventoryItem $inventoryItem): void
    {
        //
    }
}
