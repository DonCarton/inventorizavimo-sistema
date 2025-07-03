<?php

namespace App\Http\Resources;

use DateTime;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
 * @property string $first_name
 * @property string $last_name
 * @property string $email
 * @property int $laboratory
 * @property boolean $is_disabled
 * @property BelongsTo $createdBy
 */
class UserResource extends JsonResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'laboratory' => $this->laboratory,
            'facilities' => $this->facilities->pluck('id')->all(),
            'is_disabled' => $this->is_disabled,
            'created_by' => $this->createdBy->email
        ];
    }
}
