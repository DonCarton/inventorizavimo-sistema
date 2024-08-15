<?php

namespace App\Listeners;

use App\Events\AmountRunningLow;
use App\Mail\InventoryItemCriticalAmountReached;
use App\Mail\UserCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Role;

class InventoryItemAmountCritical
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(AmountRunningLow $event): \Illuminate\Http\RedirectResponse
    {
        $adminUsers = Role::findByName('admin')->users;
        foreach ($adminUsers as $adminUser) {
            Mail::to($adminUser->email)->send(new InventoryItemCriticalAmountReached($event->inventoryItem, $adminUser));
        }
        if($event->readerOrigin){
            Log::debug("Hey yo");
            return to_route('reader')
                ->with('success', __('actions.inventoryItem.updated', [
                            'local_name' => $event->inventoryItem->local_name]
                    ) . '.');
        }
        else {
            return to_route('inventoryItems.index')
                ->with('success', __('actions.inventoryItem.updated', [
                            'local_name' => $event->inventoryItem->local_name]
                    ) . '.');
        }
    }
}
