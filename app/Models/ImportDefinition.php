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

    /*
     * @param InventoryItem
     * @return BelongsTo
     */
    public  function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }

    /*
     * @param InventoryItem
     * @return BelongsTo
     */
    public  function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by')->withTrashed();
    }

    public function runs()
    {
        return $this->hasMany(ImportRun::class);
    }
}
