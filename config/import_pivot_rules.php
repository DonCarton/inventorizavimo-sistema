<?php

    /*
    |--------------------------------------------------------------------------
    | Pivot rule file
    |--------------------------------------------------------------------------
    |
    | The following settings are used to define the pivot tables of default models
    | which is then used in a validator to check if a value is linked to another one.
    |
    */

return [
    'App\\Models\\InventoryItem' => [
        'facilities' => [
            'pivot' => 'facility_laboratory',
            'primary_table' => 'facilities',
            'secondary_table' => 'laboratories',
            'primary_key' => 'facility_id',
            'secondary_key' => 'laboratory_id',
        ],
        'user' => [
            'primary_table' => 'users',
        ],
    ],
    'App\\Models\\User' => [
        //
    ],
    'App\\Models\\Laboratory' => [
        //
    ],
];
