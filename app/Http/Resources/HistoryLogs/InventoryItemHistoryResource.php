<?php

namespace App\Http\Resources\HistoryLogs;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property array $properties
 * @property string $description
 */
class InventoryItemHistoryResource extends JsonResource
{
    protected array $fields;
    protected array $newPropertiesOfHistory;
    protected array $oldPropertiesOfHistory;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $this->newPropertiesOfHistory = $this->properties['attributes'];
        foreach ($this->newPropertiesOfHistory as $property => $value) {
            $this->fields[] = $property;
        }
        if (str_contains($this->description,'updated')){
            $this->oldPropertiesOfHistory = $this->properties['old'];
        } else {
            foreach ($this->newPropertiesOfHistory as $property => $value){
                $this->oldPropertiesOfHistory[$property] = '-';
            }
        }
        return [
            'fields' => $this->fields,
            'new_values' => $this->newPropertiesOfHistory,
            'old_values' => $this->oldPropertiesOfHistory,
        ];
    }
    /**
     * Get the translated attribute name.
     *
     * @param string $attribute
     * @return string
     */
    protected function getTranslatedAttribute(string $attribute): string
    {
        return __('inventory_item.' . $attribute);
    }
}
