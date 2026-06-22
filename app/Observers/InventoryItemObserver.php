<?php

namespace App\Observers;

use App\Models\InventoryItem;
use App\Models\SystemConfiguration;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;

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
        if ($inventoryItem->isDirty('total_amount')) {
            $notifyCriticalInventory = SystemConfiguration::where('key', '=', 'critical_notification')->first();
            $notificationsEnabled = $notifyCriticalInventory != null && (int)$notifyCriticalInventory->value['value'] == 1;

            $inventoryItem->evaluateCriticalAmount($inventoryItem->total_amount, $notificationsEnabled);
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
