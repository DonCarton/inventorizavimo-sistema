<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImportRun extends Model
{
    protected $fillable = [
        'import_definition_id',
        'file_path',
        'status',
        'started_at',
        'finished_at',
        'row_count',
        'error_count',
        'output_file_path',
        'created_by',
        'updated_by'
    ];


    public function definition()
    {
        return $this->belongsTo(ImportDefinition::class,'import_definition_id');
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
}
