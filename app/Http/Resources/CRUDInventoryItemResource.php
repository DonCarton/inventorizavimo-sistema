<?php

namespace App\Http\Resources;

use App\Http\Resources\NameDisplayResource\LaboratoryName;
use App\Http\Resources\SelectObjectResources\ItemTypeForSelect;
use App\Models\Laboratory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


/**
 * @property int $id
 * @property string $local_name
 * @property BelongsTo $itemType
 * @property int $laboratory
 * @property string $name
 * @property string $name_eng
 * @property double $total_amount
 * @property double $critical_amount
 * @property BelongsTo $createdBy
 */
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
            'inventory_type' => new ItemTypeForSelect($this->itemType),
            'laboratory' => new LaboratoryName(Laboratory::find($this->laboratory)),
            'name' => $this->name,
            'name_eng' => $this->name_eng,
            'total_amount' => $this->total_amount,
            'critical_amount' => $this->critical_amount,
            'created_by' => new UserResource($this->createdBy)
        ];
    }
}
