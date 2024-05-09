<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryItemsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //return parent::toArray($request);
        return [
            'id' => $this->id,
            'local_name' => $this->local_name,
//            'type_by_duration' => $this->type_by_duration,
//            'type_by_use' => $this->type_by_use,
//            'inventory_type' => $this->inventory_type,
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
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),
            'created_by' => new UserResource($this->createdBy),
            'updated_by' => new UserResource($this->updatedBy),
        ];
    }
}
