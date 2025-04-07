<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemConfiguration extends Model
{
    use HasFactory;

    protected $fillable = ['key', 'name', 'value_type', 'category'];
    public function value()
    {
        return $this->hasOne(ConfigurationValue::class, 'configuration_id');
    }
}
