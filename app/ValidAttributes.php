<?php

namespace App;

trait ValidAttributes
{
    protected array $defaultDisclude = ['created_by', 'updated_by', 'created_at', 'updated_at', 'critical_amount_notified_at'];
    
    /**
     * Summary of fetchValidFields
     * @return void
     */
    public static function fetchValidFields(string $table): array
    {
        $instance = new static;
        $fillable = $instance->getFillable();

        $defaultDisclude = property_exists($instance, 'disclude')
            ? $instance->disclude
            : static::$defaultDisclude;

        return array_values(array_diff($fillable, $defaultDisclude));
    }
}
