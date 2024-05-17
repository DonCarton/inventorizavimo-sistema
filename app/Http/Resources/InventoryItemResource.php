<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'local_name' => $this->local_name,
            'inventory_type' => new ItemTypeResource($this->itemType),
            'name' => $this->name,
            'name_eng' => $this->name_eng,
            'provider' => $this->provider,
            'total_amount' => $this->total_count,
            'critical_amount' => $this->critical_amount,
            'url_to_provider_site' =>$this->url_to_provider,
            'laboratory' => $this->laboratory,
            'cupboard' => $this->cupboard,
            'shelf' => $this->shelf,
            'created_at' => (new Carbon($this->created_at))->setTimezone('Europe/Vilnius')->format('Y-m-d H:m'),
            'updated_at' => (new Carbon($this->updated_at))->setTimezone('Europe/Vilnius')->format('Y-m-d H:m'),
            'created_by' => new UserResource($this->createdBy),
            'updated_by' => new UserResource($this->updatedBy),
        ];
    }
}
