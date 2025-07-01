<?php

return [
    'inventory_item' => [
        'id' => 'Id',
        'name' => 'Name',
        'name_eng' => 'Name in ENG',
        'local_name' => 'Code',
        'inventory_type' => 'Type',
        'formula' => 'Formula',
        'cas_nr' => 'CAS number',
        'user_guide' => 'User guide',
        'provider' => 'Provider',
        'product_code' => 'Product code',
        'barcode' => 'Barcode',
        'provider_url' => 'Provider URL',
        'url_to_provider' => 'Provider URL',
        'alt_url_to_provider' => 'Alternate provider URL',
        'total_amount' => 'Amount',
        'critical_amount' => 'Critical amount',
        'to_order_amount' => 'To order',
        'average_consumption' => 'Average consumption',
        'multiple_locations' => 'In multiple locations?',
        'laboratory' => 'Laboratory',
        'facility' => 'Facility',
        'cupboard' => 'Cupboard',
        'shelf' => 'Shelf',
        'storage_conditions' => 'Storage conditions',
        'asset_number' => 'Asset number',
        'used_for' => 'Used for',
        'comments' => 'Comments',
        'created_at' => 'Creation date',
        'updated_at' => 'Last updated',
        'created_by' => 'Created by',
        'updated_by' => 'Updated by',
        'critical_amount_notified_at' => 'Critical amount notified at',
        'logBound' => 'This record cannot be deleted until existing inventory has been returned to the base storage.'
    ],
    'user' => [
        'first_name' => 'First name',
        'last_name' => 'Last name',
        'email' => 'Email',
        'laboratory' => 'Laboratory',
    ],
    'laboratory' => [
        'name' => 'Name',
    ],
    'item_type' => [
        'name' => 'Name',
        'change_acc_amount' => 'Can change literal amount?'
    ],
    'import_definition' => [
        'name' => 'Name',
        'model_class' => 'Object type',
        'file_path' => 'File',
    ],
    'import_run' => [
        'status' => [
            'pending' => 'Pending',
            'running' => 'Running',
            'completed' => 'Completed',
            'completed_with_errors' => 'Completed with errors',
            'failed' => 'Failed',
        ],
    ],
];
