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
 * @property DateTime $created_at
 * @property DateTime $updated_at
 * @property BelongsTo $createdBy
 * @property BelongsTo $updatedBy
 */
class LaboratoryResource extends JsonResource
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
            'name' => $this->name,
            'created_at' => $this->created_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i:s'),
            'created_by' => new UserResource($this->createdBy),
            'updated_by' => new UserResource($this->updatedBy),
        ];
    }
}
