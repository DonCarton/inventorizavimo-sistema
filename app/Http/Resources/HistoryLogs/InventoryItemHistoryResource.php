<?php

namespace App\Http\Resources\HistoryLogs;

use App\Models\ItemType;
use App\Models\Laboratory;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
class InventoryItemHistoryResource extends ResourceCollection
{
//    protected array $fields;
//    protected array $newPropertiesOfHistory;
//    protected array $oldPropertiesOfHistory;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection->transform(function ($entry) {
                $newPropertiesOfHistory = [];
                $oldPropertiesOfHistory = [];
                $fields = [];
                if (count($entry->properties) !== 0 && str_contains($entry->description, 'created')) {
                    foreach ($entry->properties['attributes'] as $property => $value){

                        $fields[] = __("inventory_item.{$property}");
//                        $newPropertiesOfHistory[] = $value;
                        $newPropertiesOfHistory[] = $this->transformValue($property, $value);
                        $oldPropertiesOfHistory[] = '-';
                    }
                } else if (str_contains($entry->description, 'updated')) {
                    foreach ($entry->properties['attributes'] as $property => $value){
                        $fields[] = __("inventory_item.{$property}");
//                        $newPropertiesOfHistory[] = $value;
                        $newPropertiesOfHistory[] = $this->transformValue($property, $value);
                    }
                    foreach ($entry->properties['old'] as $property => $value){
//                        $oldPropertiesOfHistory[] = $value;
                        $oldPropertiesOfHistory[] = $this->transformValue($property, $value);
                    }
                }
//                if (count($entry->properties) !== 0) {
//                    // Process 'created' and 'updated' actions
//                    foreach ($entry->properties['attributes'] as $property => $value) {
//                        $translatedProperty = __("inventory_item.{$property}", [], 'en');
//                        if ($translatedProperty === "inventory_item.{$property}") {
//                            $translatedProperty = ucfirst($property); // Fallback to original property
//                        }
//                        $tempFields[] = $translatedProperty;
//                        $tempNewPropertiesOfHistory[] = $value;
//                    }
//
//                    // For 'updated' actions, also handle old values
//                    if (str_contains($entry->description, 'updated')) {
//                        foreach ($entry->properties['old'] as $property => $value) {
//                            $tempOldPropertiesOfHistory[] = $value;
//                        }
//                    } else {
//                        // Default for 'created' actions
//                        $tempOldPropertiesOfHistory = array_fill(0, count($tempNewPropertiesOfHistory), '-');
//                    }
//                }
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

    private function transformValue(string $property, mixed $value)
    {
        if ($property === 'inventory_type'){
            return optional(ItemType::find($value))->name ?? $value;
        }
        if ($property === 'laboratory'){
            return optional(Laboratory::find($value))->name ?? $value;
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
