<?php

return [
    'App\\Models\\InventoryItem' => [
        'local_name' => ['required'],
        'inventory_type' => ['nullable','exists:item_types,id'],
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
        'laboratory' => ['nullable','exists:laboratories,id'],
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
        'laboratory' => ['nullable'],
    ],
    'App\\Models\\Laboratory' => [
        'name' => ['required'],
        'ident_code' => ['nullable','string','min:1','max:4',]
    ]
];
