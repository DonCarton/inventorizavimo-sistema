<?php

namespace App\Http\Resources\HistoryLogs;

use App\Enums\ModelTypeValid;
use App\Models\ItemType;
use App\Models\Laboratory;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Log;

class InventoryItemHistoryResource extends ResourceCollection
{
    protected ModelTypeValid $modelType;
    public function __construct($resource, ModelTypeValid $modelType)
    {
        $this->modelType = $modelType;
        parent::__construct($resource);
    }
    /**
     * Transform the resource into an array.
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection->transform(function ($entry) {
                $newPropertiesOfHistory = [];
                $oldPropertiesOfHistory = [];
                $fields = [];
                if (count($entry->properties['attributes']) !== 0) {
                    foreach ($entry->properties['attributes'] as $property => $value) {
                        $translatedProperty = __($this->getTranslationKey($property));
                        if ($translatedProperty === $this->getTranslationKey($property)) {
                            $translatedProperty = ucfirst($property);
                        }
                        $fields[] = $translatedProperty;
                        $newPropertiesOfHistory[] = $this->transformValue($property, $value);
                    }

                    if (str_contains($entry->description, 'updated')) {
                        foreach ($entry->properties['old'] as $property => $value) {
                            $oldPropertiesOfHistory[] = $this->transformValue($property, $value);
                        }
                    } else {
                        $oldPropertiesOfHistory = array_fill(0, count($newPropertiesOfHistory), '-');
                    }
                }
                return [
                    'definitionOfChanges' => [
                        'created_at' => $this->setUserFriendlyDateCarbon($entry->created_at),
                        'object' => optional($entry->subject)->name ?? $entry->subject_id,
                        'action' => $entry->event,
                        'causeUser' => optional($entry->causer)->email ?? $entry->causer_id,
                    ],
                    'changesForObject' => [
                        'fields' => $fields,
                        'old_values' => $oldPropertiesOfHistory,
                        'new_values' => $newPropertiesOfHistory,
                    ]
                ];
            }),
        ];
    }
    /**
     * @param string $property
     * @return string
     */
    private function getTranslationKey(string $property): string
    {
        return "model_attributes.{$this->modelType->value}.{$property}";
    }

    private function transformValue(string $property, mixed $value)
    {
        if ($property === 'inventory_type'){
            return optional(ItemType::find($value))->name ?? $value;
        }
        if ($property === 'laboratory'){
            return optional(Laboratory::find($value))->name ?? $value;
        }
        if ($property === 'cupboard'){
            return optional(\App\Models\InventoryItem::find($value))->name ?? $value;
        }
        if ($property === 'shelf'){
            return optional(\App\Models\InventoryItem::find($value))->name ?? $value;
        }
        if ($property === 'multiple_locations'){
            return $value == 1 ? __('actions.true') : __('actions.false');
        }
        return $value;
    }

    /**
     * @param DateTime $dateTime
     * @param string|null $locale
     * @param string $timezone
     * @param string $pattern
     * @return string
     */
    private function setUserFriendlyDateCarbon(DateTime $dateTime, string $locale = null, string $timezone = 'Europe/Vilnius', string $pattern = 'l j F Y H:i:s'): string
    {
        if (!$dateTime instanceof Carbon) {
            $dateTime = Carbon::parse($dateTime);
        }

        if (is_null($locale)){
            $locale = auth()->user()->locale ?? config('app.locale');
            Carbon::setLocale($locale);
        }

        return $dateTime->setTimezone($timezone)->translatedFormat($pattern);

    }
}
