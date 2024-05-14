<?php

namespace App\Listeners;

use App\Events\AmountRunningLow;
use App\Mail\InventoryItemCriticalAmountReached;
use App\Mail\UserCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

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
    public function handle(AmountRunningLow $event): void
    {
        Mail::to($event->user->email)->send(new InventoryItemCriticalAmountReached($event->inventoryItem, $event->user));
    }
}
