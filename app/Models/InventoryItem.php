<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'local_name',
        'name',
        'name_eng',
        'barcode',
        'created_by',
        'updated_by',
        'total_count'
    ];
    public function itemType(): HasOne
    {
        return $this->hasOne(ItemType::class, 'id');
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
