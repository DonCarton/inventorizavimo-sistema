<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImportRun extends Model
{
    protected $fillable = [
        'import_definition_id',
        'file_path',
        'status',
        'file_path',
        'created_by',
        'updated_by'
    ];


    public function definition()
    {
        return $this->belongsTo(ImportDefinition::class,'import_definition_id');
    }
}
