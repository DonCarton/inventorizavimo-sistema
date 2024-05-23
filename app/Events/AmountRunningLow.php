<?php

namespace App\Events;

use App\Models\InventoryItem;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AmountRunningLow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public InventoryItem $inventoryItem;
    public bool $readerOrigin;
    /**
     * Create a new event instance.
     * @param InventoryItem $inventoryItem
     */
    public function __construct(InventoryItem $inventoryItem, bool $readerOrigin)
    {
        $this->inventoryItem = $inventoryItem;
        $this->readerOrigin = $readerOrigin;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
