<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConfigurationValue extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['configuration_id', 'value'];

    public function configuration(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SystemConfiguration::class, 'configuration_id');
    }
}
