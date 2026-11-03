<?php

namespace App\Http\Resources;

use DateTimeZone;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MeasurementUnitResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'decimalPlaces' => $this->decimal_places,
            'isActive' => $this->is_active,
            'itemCount' => $this->whenCounted('inventoryItems'),
            'updatedAt' => $this->updated_at?->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i:s'),
            'updatedBy' => $this->updatedBy?->email,
        ];
    }
}
