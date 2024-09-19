<?php

namespace App\Http\Resources\IndexResources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SystemConfigurationIndexResource extends JsonResource
{
    private function getRawValue()
    {
        if ($this->string_value !== null) {
            return (string)$this->string_value;
        } else if ($this->integer_value !== null) {
            return (integer)$this->integer_value;
        } else {
            return (boolean)$this->boolean_value;
        }
    }
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'key' => $this->key,
            'name' => $this->name,
            'value' => $this->getRawValue(),
            'category' => $this->category,
            // $this->key => [
            //     'name' => $this->name,
            //     'value' => $this->getRawValue(),
            //     'category' => $this->category,
            // ]
        ];
    }
}
