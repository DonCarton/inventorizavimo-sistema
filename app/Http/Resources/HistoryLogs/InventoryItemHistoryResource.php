<?php

namespace App\Http\Resources\HistoryLogs;

use Carbon\Carbon;
use DateTime;
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
                $tempNewPropertiesOfHistory = [];
                $tempOldPropertiesOfHistory = [];
                $tempFields = [];
                if (count($entry->properties) !== 0 && str_contains($entry->description, 'created')) {
                    foreach ($entry->properties['attributes'] as $property => $value){
                        $tempFields[] = $property;
                        $tempNewPropertiesOfHistory[] = $value;
                        $tempOldPropertiesOfHistory[] = '-';
                    }
                } else if (str_contains($entry->description, 'updated')) {
                    foreach ($entry->properties['attributes'] as $property => $value){
                        $tempFields[] = $property;
                        $tempNewPropertiesOfHistory[] = $value;
                    }
                    foreach ($entry->properties['old'] as $property => $value){
                        $tempOldPropertiesOfHistory[] = $value;
                    }
                }

                return [
                    'definitionOfChanges' => [
                        'created_at' => $this->setUserFriendlyDateCarbon($entry->created_at),
                        'object' => $entry->subject_id,
                        'action' => $entry->description,
                        'causeUser' => $entry->causer_id,
                    ],
                    'changesForObject' => [
                        'fields' => $tempFields,
                        'old_values' => $tempOldPropertiesOfHistory,
                        'new_values' => $tempNewPropertiesOfHistory,
                    ]
                ];
            }),
        ];
    }

    private function setUserFriendlyDateCarbon(DateTime $dateTime, string $locale = null, string $timezone = 'Europe/Vilnius', string $pattern = 'l j F Y H:i:s'): string
    {
        if (!$dateTime instanceof Carbon) {
            $dateTime = Carbon::parse($dateTime);
        }

        if (is_null($locale)){
            $locale = auth()->user()->locale ?? config('app.locale');
            Carbon::setLocale($locale);
        }

        $formattedDate = $dateTime->setTimezone($timezone)->translatedFormat($pattern);

        return $formattedDate;

    }
}
