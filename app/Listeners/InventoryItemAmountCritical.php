<?php

namespace App\Listeners;

use App\Enums\RoleEnum;
use App\Events\AmountRunningLow;
use App\Mail\InventoryItemCriticalAmountReached;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class InventoryItemAmountCritical implements ShouldQueue
{
    public int $tries = 3;

    /**
     * Seconds to wait before each retry: 1 minute, then 5, then 15.
     *
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [60, 300, 900];
    }

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

    /**
     * Handle a job failure.
     */
    public function failed(AmountRunningLow $event, Throwable $exception): void
    {
        Log::error('Failed to notify admins about critical inventory amount', [
            'inventory_item_id' => $event->inventoryItem->id,
            'local_name' => $event->inventoryItem->local_name,
            'exception' => $exception->getMessage(),
        ]);
    }
}
