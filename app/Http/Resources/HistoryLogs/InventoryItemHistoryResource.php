<?php

namespace App\Http\Resources\HistoryLogs;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
class InventoryItemHistoryResource extends ResourceCollection
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
        return [
            'data' => $this->collection->transform(function ($entry) {
                return [
                    'local_name' => $entry->local_name,
                    'name' => $entry->name,
                ];
            }),
        ];
    }
}
