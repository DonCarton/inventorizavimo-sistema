<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RichInventoryItemResource extends JsonResource
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
            'accordionCategories' => [
                [
                    'title' => 'Amount',
                    'content' => [
                        'total_amount' => $this->total_count,
                        'critical_amount' => $this->critical_amount,
                    ],
                ],
                [
                    'title' => 'Location',
                    'content' => [
                        'laboratory' => $this->laboratory,
                        'cupboard' => $this->cupboard,
                        'shelf' => $this->shelf,
                    ],
                ],
                [
                    'title' => 'General info',
                    'content' => [
                        'local_name' => $this->local_name,
                        'name' => $this->name,
                        'name_eng' => $this->name_eng,
                        'inventory_type' => $this->inventory_type,
                    ],
                ],
                [
                    'title' => 'Order info',
                    'content' => [
                        'provider' => $this->provider,
                        'url_to_provider_site' => $this->url_to_provider,
                        'asset_number' => $this->asset_number,
                    ],
                ],
            ],
        ];
    }
}
