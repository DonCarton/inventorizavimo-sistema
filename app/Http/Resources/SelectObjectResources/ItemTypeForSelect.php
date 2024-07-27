<?php

namespace App\Http\Resources\SelectObjectResources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
 * @property string $name
 * @property bool $change_acc_amount
 */
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
