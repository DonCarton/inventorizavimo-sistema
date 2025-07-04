<?php

namespace App\Http\Resources;

use App\Models\InventoryItem;
use DateTime;
use DateTimeZone;
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
 * @property double $total_amount
 * @property double $critical_amount
 * @property double $to_order_amount
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
            'totalAmount' => $this->total_amount,
            'criticalAmount' => $this->critical_amount,
            'toOrderAmount' => $this->to_order_amount,
            'averageConsumption' => $this->average_consumption,
            'multipleLocations' => $this->multiple_locations,
            'laboratory' => $this->laboratory,
            'facilities' => $this->facilities->pluck('id')->all(),
            'cupboard' => (int)$this->cupboard,
            'shelf' => $this->shelf,
            'storageConditions' => $this->storage_conditions,
            'assetNumber' => $this->asset_number,
            'usedFor' => $this->used_for,
            'comments' => $this->comments,
            'created_at' => $this->created_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i:s'),
            'created_by' => (new UserResource($this->createdBy))->email,
            'updated_by' => (new UserResource($this->updatedBy))->email,
        ];
    }
}
