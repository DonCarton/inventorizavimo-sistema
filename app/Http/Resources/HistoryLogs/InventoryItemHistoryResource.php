<?php

namespace App\Http\Resources\HistoryLogs;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryItemHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // TODO: Define this to output history
        dd($request);
        return [
            __('Code') => $this->local_name,
            __('Name') => $this->name,
            __('Name_end') => $this->name_eng,
            __('Inventory_type') => $this->inventory_type,
            __('Laboratory') => $this->laboratory,
            __('Asset number') => $this->asset_nr,
            __('Used for') => $this->used_for,
            __('Comments') => $this->comments,
        ];
    }
}
