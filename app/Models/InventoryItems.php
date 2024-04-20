<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class InventoryItems extends Model
{
    use HasFactory;
    #protected $fillable = ['created_by', 'updated_by'];
    public function typeByDuration(): HasOne
    {
        return $this->hasOne(ItemTypes::class, 'type_by_duration');
    }
    public function typeByUser(): HasOne
    {
        return $this->hasOne(ItemTypes::class, 'type_by_use');
    }
    public  function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public  function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
//    protected static function boot()
//    {
//        parent::boot();
//
//        static::saving(function ($model) {
//            if (!$model->exists) {
//                $model->created_by = Auth::id();
//            }
//        });
//
//        static::updating(function ($model) {
//            $model->updated_by = Auth::id();
//        });
//    }
}