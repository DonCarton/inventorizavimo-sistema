<?php

namespace App\Http\Resources;

use DateTime;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
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
        return [
            'id' => $this->id,
            'definition_name' => (new ImportDefinitionResource($this->definition))->name,
            'model_class' => ucfirst(__('objects.'.(new ImportDefinitionResource($this->definition))->model_class)),
            'created_by' => (new UserResource($this->createdBy))->email,
            'updated_by' => (new UserResource($this->updatedBy))->email,
        ];
    }
}
