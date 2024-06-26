<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemTypeResource extends JsonResource
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
            'name' => $this->name,
            'change_acc_amount' => (bool)$this->change_acc_amount,
            'created_at' => (new Carbon($this->created_at))->setTimezone('Europe/Vilnius')->format('Y-m-d H:m'),
            'updated_at' => (new Carbon($this->created_at))->setTimezone('Europe/Vilnius')->format('Y-m-d H:m'),
            'created_by' => new UserResource($this->createdBy),
            'updated_by' => new UserResource($this->updatedBy),
        ];
    }
}
