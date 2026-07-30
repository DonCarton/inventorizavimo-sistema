<?php

namespace App\Http\Resources\EditResources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImportRunEditResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'file_path' => str_replace('imports/','',$this->file_path),
            'started_at' => $this->started_at?->setTimezone('Europe/Vilnius')->format('Y-m-d H:i'),
            'finished_at' => $this->finished_at?->setTimezone('Europe/Vilnius')->format('Y-m-d H:i'),
            'row_count' => $this->row_count,
            'error_count' => $this->error_count,
            'has_failure_report' => !is_null($this->output_file_path),
        ];
    }
}
