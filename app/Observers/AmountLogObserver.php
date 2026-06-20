<?php

namespace App\Observers;

use App\Models\AmountLog;
use App\Models\SystemConfiguration;

class AmountLogObserver
{
    /**
     * Handle the AmountLog "created" event.
     * @param AmountLog $amountLog
     * @return void
     */
    public function created(AmountLog $amountLog): void
    {
        $notifyCriticalInventory = SystemConfiguration::where('key', '=', 'critical_notification')->first();
        $notificationsEnabled = $notifyCriticalInventory != null && (int)$notifyCriticalInventory->value['value'] == 1;

        $totalAmountInInventory = $amountLog->inventoryItem->total_amount;

        $amountRemoved = AmountLog::where('inventory_item_id', $amountLog->inventoryItem->id)->where('action', 'REMOVE')->sum('amount');
        $amountReturned = AmountLog::where('inventory_item_id', $amountLog->inventoryItem->id)->where('action', 'RETURN')->sum('amount');

        $remainingAmount = $totalAmountInInventory - ($amountRemoved - $amountReturned);

        $amountLog->inventoryItem->evaluateCriticalAmount($remainingAmount, $notificationsEnabled);
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
