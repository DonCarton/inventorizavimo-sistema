<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemConfiguration extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'name',
        'boolean_value'
    ];

    protected $casts = [
        'boolean_value' => 'boolean',
    ];
}
