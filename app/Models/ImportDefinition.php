<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImportDefinition extends Model
{
    protected $fillable = [
        'name',
        'model_class',
        'field_mappings',
        'file_path',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'field_mappings' => 'array',
    ];

    /**
     * Get the model instance for the import definition.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function getModelInstance(): Model
    {
        return new $this->model_class;
    }

    /**
     * Get the user that owns the import definition (optional).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function runs()
    {
        return $this->hasMany(ImportRun::class)
    }
}
