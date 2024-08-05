<?php

namespace App\Http\Resources\HistoryLogs;

use Carbon\Carbon;
use DateTime;
use DateTimeZone;
use IntlDateFormatter;
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
        // Carbon::setLocale('lt');
        return [
            'data' => $this->collection->transform(function ($entry) {
                return [
                    'description' => $entry->description,
                    'causer_type' => \App\Models\User::find($entry->causer_id)->email,
                    // 'updatedAt' => $entry->updated_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('Y-M-d H:i:s'),
                    'updatedAt' => $entry->updated_at->setTimezone(new DateTimeZone('Europe/Vilnius'))->format('l j F Y'),
                    'updated_at' => $this->setUserFriendlyDateCarbon($entry->updated_at),
                ];
            }),
        ];
    }

    private function setUserFriendlyDateCarbon(DateTime $dateTime, string $locale = null, $timezone = 'Europe/Vilnius', $pattern = 'l j F Y H:i:s'): string
    {
        if (!$dateTime instanceof Carbon) {
            $dateTime = Carbon::parse($dateTime);
        }

        if (is_null($locale)){
            $locale = auth()->user()->locale ?? config('app.locale');
            Carbon::setLocale($locale);
        }

        $formattedDate = $dateTime->translatedFormat($pattern);

        return $formattedDate;

    }

    private function setUserFriendlyDate(DateTime $dateTime, string $locale = null, $timezone = 'Europe/Vilnius', $pattern = 'EEEE d MMMM yyyy HH:mm:ss'): string
    {
        if (!$dateTime instanceof Carbon) {
            $dateTime = Carbon::parse($dateTime);
        }

        if (is_null($locale)){
            $locale = auth()->user()->locale ?? config('app.locale');
        }

        $formatter = new IntlDateFormatter(
            $locale,
            IntlDateFormatter::FULL,
            IntlDateFormatter::FULL,
            $timezone,
            IntlDateFormatter::GREGORIAN,
            $pattern
        );

        return $formatter->format($dateTime);
    }
}
