<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConfigurationValue extends Model
{
    use HasFactory;

    protected $fillable = ['configuration_id', 'value'];

    public function configuration()
    {
        return $this->belongsTo(SystemConfiguration::class, 'configuration_id');
    }
}
