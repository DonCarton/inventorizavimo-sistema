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
 * @property string $model_class
 * @property DateTime $updated_at
 * @property BelongsTo $createdBy
 * @property BelongsTo $updatedBy
 * @property BelongsTo $runs
 */
class ImportDefinitionResource extends JsonResource
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
            'model_class' => ucfirst(__('objects.'.$this->model_class)),
            'updated_at' => $this->updated_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i'),
            'created_by' => (new UserResource($this->createdBy))->email,
            'has_active_run' => $this->runs()->whereIn('status', ['pending', 'running'])->exists(),
            'latest_run' => $this->whenLoaded('latestRun', fn () => $this->latestRun ? [
                'status' => __('model_attributes.import_run.status.' . $this->latestRun->status),
                'updated_at' => $this->latestRun->updated_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-m-d H:i'),
            ] : null),
        ];
    }
}
