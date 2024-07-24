<?php

namespace App\Http\Resources\IndexResources;

use App\Http\Resources\ItemTypeResource;
use App\Models\InventoryItem;
use App\Http\Resources\LaboratoryResource;
use App\Http\Resources\UserResource;
use Carbon\Carbon;
use DateTime;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
 * @property string $local_name
 * @property BelongsTo $itemType;
 * @property string $name;
 * @property string $name_eng;
 * @property string $provider;
 * @property float $total_count;
 * @property float $critical_amount;
 * @property string $url_to_provider;
 * @property BelongsTo $belongsToLaboratory;
 * @property int $cupboard;
 * @property int $shelf;
 * @property datetime $created_at;
 * @property datetime $updated_at;
 * @property BelongsTo $createdBy;
 * @property BelongsTo $updatedBy;
 * @method getStatusAttribute()
 */
class InventoryItemIndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @param Request $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'local_name' => $this->local_name,
            'inventory_type' => (new ItemTypeResource($this->itemType))->name ?? '',
            'name' => $this->name,
            'name_eng' => $this->name_eng,
            'provider' => $this->provider,
            'total_amount' => $this->total_count,
            'inventory_status' => $this->getStatusAttribute(),
            'url_to_provider_site' =>$this->url_to_provider,
            'laboratory' => (new LaboratoryResource($this->belongsToLaboratory))->name ?? '',
            'cupboard' => $this->cupboard,
            'shelf' => $this->shelf,
            'created_at' => (new Carbon($this->created_at))->setTimezone('Europe/Vilnius')->format('Y-m-d H:m'),
            'updated_at' => (new Carbon($this->updated_at))->setTimezone('Europe/Vilnius')->format('Y-m-d H:m'),
            'created_by' => (new UserResource($this->createdBy))->email,
            'updated_by' => (new UserResource($this->updatedBy))->email,
        ];
    }
}
