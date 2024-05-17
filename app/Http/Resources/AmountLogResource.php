<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AmountLogResource extends JsonResource
{
    public static $withoutWrapping = true;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'inventory_item_id' => $this->inventory_item_id,
            'laboratory' => new LaboratoryResource($this->inventoryItem),
            'action_taken' => $this->action,
            'amount_handled' => $this->amount,
            'comment' => $this->comment,
            'created_by' => new UserResource($this->createdBy),
            'created_at' => (new Carbon($this->created_at))->setTimezone('Europe/Vilnius')->format('Y-m-d H:m'),
        ];
    }
}
