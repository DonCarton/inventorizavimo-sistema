<?php

namespace App\Http\Resources\SelectObjectResources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemTypeForSelect extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'value' => $this->id,
            'label' => $this->name,
            'assetRequired' => (boolean)$this->change_acc_amount
        ];
    }
}
