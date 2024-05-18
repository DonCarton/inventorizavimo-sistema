<?php

namespace App\Http\Resources;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CRUDInventoryItemResource extends JsonResource
{
    public static $wrap = false;
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
            'inventory_type' => $this->inventory_type,
            'name' => $this->name,
            'name_eng' => $this->name_eng,
            'total_amount' => $this->total_count,
            'critical_amount' => $this->critical_amount,
            'created_by' => new UserResource($this->createdBy)
        ];
    }
}
