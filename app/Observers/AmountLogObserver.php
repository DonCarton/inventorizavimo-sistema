<?php

namespace App\Observers;

use App\Events\AmountRunningLow;
use App\Models\AmountLog;

class AmountLogObserver
{
    /**
     * Handle the AmountLog "created" event.
     * @param AmountLog $amountLog
     * @return void
     */
    public function created(AmountLog $amountLog): void
    {
        $totalAmountInInventory = $amountLog->inventoryItem->total_amount;
        $criticalAmountInInventory = $amountLog->inventoryItem->critical_amount;

        $amountRemoved = AmountLog::where('inventory_item_id',$amountLog->inventoryItem->id)->where('action','REMOVE')->sum('amount');
        $amountReturned = AmountLog::where('inventory_item_id',$amountLog->inventoryItem->id)->where('action','RETURN')->sum('amount');

        $remainingAmount = $totalAmountInInventory - ($amountRemoved - $amountReturned);

        if ($remainingAmount <= $criticalAmountInInventory && is_null($amountLog->inventoryItem->critical_amount_notified_at)) {
            event(new AmountRunningLow($amountLog->inventoryItem, false));
            $amountLog->inventoryItem->critical_amount_notified_at = now();
            $amountLog->inventoryItem->saveQuietly();
        } else if ($remainingAmount > $criticalAmountInInventory && !is_null($amountLog->inventoryItem->critical_amount_notified_at)){
            $amountLog->inventoryItem->critical_amount_notified_at = null;
            $amountLog->inventoryItem->saveQuietly();
        }
    }

    /**
     * Handle the AmountLog "updated" event.
     */
    public function updated(AmountLog $amountLog): void
    {
        //
    }

    /**
     * Handle the AmountLog "deleted" event.
     */
    public function deleted(AmountLog $amountLog): void
    {
        //
    }

    /**
     * Handle the AmountLog "restored" event.
     */
    public function restored(AmountLog $amountLog): void
    {
        //
    }

    /**
     * Handle the AmountLog "force deleted" event.
     */
    public function forceDeleted(AmountLog $amountLog): void
    {
        //
    }
}
