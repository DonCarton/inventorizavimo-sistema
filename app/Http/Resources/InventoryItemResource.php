<?php

namespace App\Http\Resources;

use DateTime;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
 * @property string $local_name
 * @property int $inventory_type
 * @property string $name
 * @property string $name_eng
 * @property string $formula
 * @property string $cas_nr
 * @property string $user_guide
 * @property string $provider
 * @property string $product_code
 * @property string $barcode
 * @property string $url_to_provider
 * @property string $alt_url_to_provider
 * @property double $total_count
 * @property double $critical_amount
 * @property double $to_order
 * @property double $average_consumption
 * @property boolean $multiple_locations
 * @property int $laboratory
 * @property int $cupboard
 * @property int $shelf
 * @property string $storage_conditions
 * @property string $asset_number
 * @property string $used_for
 * @property string $comments
 * @property DateTime $created_at
 * @property DateTime $updated_at
 * @property BelongsTo $createdBy
 * @property BelongsTo $updatedBy
 */
class InventoryItemResource extends JsonResource
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
            'localName' => $this->local_name,
            'inventoryType' => $this->inventory_type,
            'name' => $this->name,
            'nameEng' => $this->name_eng,
            'formula' => $this->formula,
            'casNr' => $this->cas_nr,
            'userGuide' => $this->user_guide,
            'provider' => $this->provider,
            'productCode' => $this->product_code,
            'barcode' => $this->barcode,
            'urlToProviderSite' =>$this->url_to_provider,
            'altUrlToProviderSite' =>$this->alt_url_to_provider,
            'total_amount' => $this->total_count,
            'criticalAmount' => $this->critical_amount,
            'toOrder' => $this->to_order,
            'averageConsumption' => $this->average_consumption,
            'multipleLocations' => $this->multiple_locations,
            'laboratory' => $this->laboratory,
            'cupboard' => $this->cupboard,
            'shelf' => $this->shelf,
            'storageConditions' => $this->storage_conditions,
            'assetNumber' => $this->asset_number,
            'usedFor' => $this->used_for,
            'comments' => $this->comments,
            'created_at' => (new Carbon($this->created_at))->setTimezone('Europe/Vilnius')->format('Y-m-d H:m'),
            'updated_at' => (new Carbon($this->updated_at))->setTimezone('Europe/Vilnius')->format('Y-m-d H:m'),
            'created_by' => (new UserResource($this->createdBy))->email,
            'updated_by' => (new UserResource($this->updatedBy))->email,
        ];
    }
}
