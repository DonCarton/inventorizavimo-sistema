<?php

return [

    'created' => 'Created',
    'updated' => 'Updated',
    'deleted' => 'Deleted',
    'saved' => 'Saved',
    'uploaded' => [
        'success' => 'File [:name] has been successfully uploaded!',
        'not_fully' => 'The file was not fully imported, an email with the failures will be sent separately.'
    ],
    'user' => [
        'created' => 'New user [:email] has been created.',
        'updated' => 'User [:email] has been updated.',
        'activated' => 'User [:email] activated.',
        'deactivated' => 'User [:email] deactivated.',
        'deleted' => 'User [:email] has been deleted.',
        'selfDelete' => 'You cannot delete your own account.',
        'selfDeactivate' => 'You cannot deactivate yourself.',
        'noUsersLeft' => 'The record could not be deleted as there will be no users left.',
        'deletedUser' => 'Deleted user.'
    ],
    'laboratory' => [
        'created' => 'New laboratory [:name] has been created.',
        'updated' => 'Laboratory [:name] has been updated.',
        'deleted' => 'Laboratory [:name] has been deleted successfully.',
    ],
    'facility' => [
        'created' => 'New facility [:name] has been created.',
        'updated' => 'Facility [:name] has been updated.',
        'deleted' => 'Facility [:name] has been deleted successfully.',
    ],
    'inventoryItem' => [
        'created' => 'New entry [:local_name] has been created.',
        'logged' => 'Separate entry for [:local_name] has been created.',
        'updated' => 'Entry [:local_name] has been updated.',
        'deleted' => 'Entry [:local_name] has been deleted.',
        'volumeMismatch' => 'The specified amount exceeds the amount available in the laboratory.'
    ],
    'itemType' => [
        'created' => 'New type [:name] has been created.',
        'updated' => 'Type [:name] has been updated.',
        'deleted' => 'Type [:name] has been deleted successfully.',
        'still_related' => 'The type still has inventory items which use it as a definition [:count], unable to delete.'
    ],
    'noItemFound' => 'Code recognized [:name], but entry not found.',
    'true' => 'True',
    'false' => 'False',
    'denied' => 'Action is denied.',
    'invalidDelete' => 'You cannot delete this item.',
    'imports' => [
        'row' => 'row in file',
        'value' => 'value',
        'field' => 'field',
        'error_type' => 'error type',
        'error_message' => 'error message',
        'issue_types' => [
            'empty' => 'empty row',
            'validation' => 'data clarity',
            'exception' => 'exception',
        ],
    ],
    'importDefinition' => [
        'created' => 'New import definition [:name] has been created.',
        'created_and_import' => 'New import definition [:name] has been created and import started.',
        'updated' => 'Import definition [:name] has been updated.',
        'deleted' => 'Import definition [:name] has been deleted successfully.',
    ],
    'unavailable' => 'Unavailable.',
];
