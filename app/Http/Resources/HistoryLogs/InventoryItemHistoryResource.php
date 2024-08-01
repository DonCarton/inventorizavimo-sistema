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
        return parent::toArray($request);
    }
}
