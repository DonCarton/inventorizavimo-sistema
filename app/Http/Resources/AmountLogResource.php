<?php

namespace App\Http\Resources;

use DateTime;
use DateTimeZone;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


/**
 * @property int $inventory_item_id
 * @property BelongsTo $inventoryItem
 * @property string $action
 * @property double $amount
 * @property string $comment
 * @property BelongsTo $createdBy
 * @property DateTime $created_at
 */
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
            'created_at' => $this->created_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i'),
        ];
    }
}
