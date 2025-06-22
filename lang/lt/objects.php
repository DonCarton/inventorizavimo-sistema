<?php

return [
    'App\\Models\\User' => 'naudotojas',
    'App\\Models\\InventoryItem' => 'inventorius',
    'App\\Models\\Laboratory' => 'laboratorija',
    'labels' => [
        'singular' => [
            'inventoryItem' => 'inventoriaus įrašas',
            'user' => 'naudotoju',
            'laboratory' => 'laboratorija',
            'facility' => 'patalpa',
        ],
        'plural' => [
            'inventoryItem' => 'inventoriaus įrašais',
            'user' => 'naudotojais',
            'laboratory' => 'laboratorijomis',
            'facility' => 'patalpomis',
        ]
    ],
];
