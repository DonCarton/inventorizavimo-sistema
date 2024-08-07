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
     */
    public function updated(InventoryItem $inventoryItem): void
    {
        if ($inventoryItem->total_amount <= $inventoryItem->critical_amount){
            event(new AmountRunningLow($inventoryItem, false));
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
