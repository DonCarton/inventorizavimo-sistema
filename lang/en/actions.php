<?php

return [

    'created' => 'Created',
    'updated' => 'Updated',
    'deleted' => 'Deleted',
    'saved' => 'Saved',
    'uploaded' => 'File :name has been successfully uploaded',
    'user' => [
        'created' => 'New user :email has been created',
        'updated' => 'User :email has been updated',
        'activated' => 'User :email activated',
        'deactivated' => 'User :email deactivated'
    ],
    'laboratory' => [
        'created' => 'New location :name has been created',
        'updated' => 'Location :name has been updated',
        'deleted' => 'Location :name cannot be deleted right now'
    ],
    'inventoryItem' => [
        'created' => 'New entry :local_name has been created',
        'logged' => 'Separate entry for :local_name has been created',
        'updated' => 'Entry :local_name has been updated',
        'deleted' => 'Entry :local_name has been deleted',
        'volumeMismatch' => 'The specified amount exceeds the amount available in the laboratory'
    ],
    'itemType' => [
        'created' => 'New type :name has been created',
        'updated' => 'Type :name has been updated',
        'deleted' => 'Type :name cannot be deleted right now'
    ],
    'noItemFound' => 'Code recognized (:name), but entry not found'


];
