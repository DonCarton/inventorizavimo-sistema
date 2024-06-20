<?php

namespace App\Http\Resources;

use App\Http\Resources\NameDisplayResource\LaboratoryName;
use App\Models\Laboratory;
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
        $laboratory = Laboratory::find($this->laboratory);
        return [
            'id' => $this->id,
            'local_name' => $this->local_name,
            'inventory_type' => $this->inventory_type,
            'laboratory' => new LaboratoryName(Laboratory::find($this->laboratory)),
            'name' => $this->name,
            'name_eng' => $this->name_eng,
            'total_amount' => $this->total_count,
            'critical_amount' => $this->critical_amount,
            'created_by' => new UserResource($this->createdBy)
        ];
    }
}
