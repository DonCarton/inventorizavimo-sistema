<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ImportRunRecord extends Model
{
    protected $fillable = [
        'import_run_id',
        'recordable_type',
        'recordable_id',
        'action',
    ];

    public function importRun(): BelongsTo
    {
        return $this->belongsTo(ImportRun::class);
    }

    public function recordable(): MorphTo
    {
        return $this->morphTo();
    }
}
