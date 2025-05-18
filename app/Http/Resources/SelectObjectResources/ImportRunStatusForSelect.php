<?php

namespace App\Http\Resources\SelectObjectResources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImportRunStatusForSelect extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        dd($this);
        return [
            'value' => $this->id,
            'label' => $this->name,
        ];
    }
}
