<?php

namespace App\Http\Resources;

use DateTime;
use DateTimeZone;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
 * @property string $name
 * @property bool $change_acc_amount
 * @property DateTime $created_at
 * @property DateTime $updated_at
 * @property BelongsTo $createdBy
 * @property BelongsTo $updatedBy
 */
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
            'changeAccAmount' => $this->change_acc_amount,
            'created_at' => $this->created_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i:s'),
            'createdBy' => new UserResource($this->createdBy),
            'updatedBy' => new UserResource($this->updatedBy),
        ];
    }
}
