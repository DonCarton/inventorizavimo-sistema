<?php

use App\Rules\ExistsByNumericOrString;
use App\Rules\HasRelationMethod;

return [
    'App\\Models\\InventoryItem' => [
        'local_name' => ['required'],
        'inventory_type' => ['nullable', new ExistsByNumericOrString('item_types', 'inventory_type')],
        'name' => ['nullable', 'string', 'max:255'],
        'name_eng' => ['nullable', 'string', 'max:255'],
        'formula' => ['nullable', 'string'],
        'cas_nr' => ['nullable'],
        'user_guide' => ['nullable'],
        'provider' => ['nullable'],
        'product_code' => ['nullable'],
        'barcode' => ['nullable'],
        'url_to_provider' => ['nullable', 'string'],
        'alt_url_to_provider' => ['nullable', 'string'],
        'total_amount' => ['nullable', 'numeric', 'min:0'],
        'critical_amount' => ['nullable', 'numeric'],
        'to_order_amount' => ['nullable', 'numeric'],
        'average_consumption' => ['nullable'],
        'multiple_locations' => ['boolean'],
        'laboratory' => ['nullable', new ExistsByNumericOrString(table: 'laboratories',attributeName: 'laboratory')],
        'facilities' => ['nullable',
            new HasRelationMethod(modelClass: App\Models\InventoryItem::class, relationName: 'facilities'),
            new ExistsByNumericOrString(table:'facilities', attributeName:'facilities', idColumn:'id', nameColumn:'name', allowPipeSeparated: true),
            'pivot,laboratory',
        ],
        'cupboard' => ['nullable','numeric'],
        'shelf' => ['nullable','string'],
        'storage_conditions' => ['nullable'],
        'used_for' => ['nullable'],
        'comments' => ['nullable'],
    ],
    'App\\Models\\User' => [
        'first_name' => ['required'],
        'last_name' => ['required'],
        'email' => ['required'],
        'laboratory' => ['required', new ExistsByNumericOrString(table: 'laboratories',attributeName: 'laboratory')],
    ],
    'App\\Models\\Laboratory' => [
        'name' => ['required'],
        'ident_code' => ['nullable','string','min:1','max:4',],
        'facilities' => ['nullable', new ExistsByNumericOrString(table: 'facilities', attributeName: 'facilities', allowPipeSeparated: true)]
    ]
];
