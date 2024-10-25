<?php

namespace App\Http\Resources\IndexResources;

use App\Enums\RoleEnum;
use App\Http\Resources\ItemTypeResource;
use App\Http\Resources\LaboratoryResource;
use App\Http\Resources\UserResource;
use DateTime;
use DateTimeZone;
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
 * @property double $total_amount;
 * @property double $critical_amount;
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
            'localName' => $this->local_name,
            'inventoryType' => (new ItemTypeResource($this->itemType))->name ?? '',
            'name' => $this->name,
            'nameEng' => $this->name_eng,
            'provider' => $this->provider,
            'totalAmount' => $this->total_amount,
            'inventoryStatus' => $this->getStatusAttribute(),
            'urlToProviderSite' =>$this->url_to_provider,
            'laboratory' => (new LaboratoryResource($this->belongsToLaboratory))->name ?? '',
            'cupboard' => $this->cupboard,
            'shelf' => $this->shelf,
            'created_at' => $this->created_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i:s'),
            'createdBy' => (new UserResource($this->createdBy))->email,
            'updatedBy' => (new UserResource($this->updatedBy))->email,
            'can' => [
                'edit' => $request->user()->hasAnyRole([RoleEnum::ADMIN,RoleEnum::SUPER_ADMIN]),
            ]
        ];
    }
}
