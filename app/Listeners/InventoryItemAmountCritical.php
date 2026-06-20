<?php

namespace App\Listeners;

use App\Enums\RoleEnum;
use App\Events\AmountRunningLow;
use App\Mail\InventoryItemCriticalAmountReached;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class InventoryItemAmountCritical implements ShouldQueue
{
    /**
     * Handle the event.
     */
    public function handle(AmountRunningLow $event): void
    {
        $recipients = User::role([RoleEnum::ADMIN, RoleEnum::SUPER_ADMIN])->get();

        foreach ($recipients as $recipient) {
            Mail::to($recipient->email)->queue(new InventoryItemCriticalAmountReached($event->inventoryItem, $recipient));
        }
    }
}
