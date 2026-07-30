<?php

namespace App\Http\Resources;

use DateTime;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
 * @property string $status
 * @property BelongsTo $definition
 * @property BelongsTo $createdBy
 * @property BelongsTo $updatedBy
 */
class ImportRunResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $statusTranslationKey = $this->status;
        return [
            'id' => $this->id,
            'definition_name' => (new ImportDefinitionResource($this->definition))->name,
            'status' => __('model_attributes.import_run.status.' . $statusTranslationKey),
            'model_class' => ucfirst(__('objects.'.(new ImportDefinitionResource($this->definition))->model_class)),
            'started_at' => $this->started_at?->setTimezone('Europe/Vilnius')->format('Y-m-d H:i'),
            'finished_at' => $this->finished_at?->setTimezone('Europe/Vilnius')->format('Y-m-d H:i'),
            'row_count' => $this->row_count,
            'error_count' => $this->error_count,
            'has_failure_report' => !is_null($this->output_file_path),
            'created_by' => (new UserResource($this->createdBy))->email,
            'updated_by' => (new UserResource($this->updatedBy))->email,
        ];
    }
}
