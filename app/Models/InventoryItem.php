<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed $amountLogs
 * @property mixed $id
 * @method static findOrFail(int $id)
 */
class InventoryItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'local_name',
        'name',
        'name_eng',
        'laboratory',
        'critical_amount',
        'barcode',
        'created_by',
        'updated_by',
        'total_count'
    ];
    public function itemType(): HasOne
    {
        return $this->hasOne(ItemType::class, 'id');
    }
    public function laboratory(): HasOne
    {
        return $this->hasOne(Laboratory::class);
    }
    public  function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public  function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    public function amountLogs(): HasMany
    {
        return $this->hasMany(AmountLog::class, 'inventory_item_id');
    }
}
