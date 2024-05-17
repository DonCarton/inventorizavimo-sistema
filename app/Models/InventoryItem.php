<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $amountLogs
 * @property int $id
 * @property int $itemType
 * @property int $total_count
 * @property string $local_name
 * @method static findOrFail(int $id)
 * @method static create(mixed $data)
 */
class InventoryItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'local_name',
        'inventory_type',
        'name',
        'name_eng',
        'laboratory',
        'critical_amount',
        'barcode',
        'created_by',
        'updated_by',
        'total_count'
    ];
    public function itemType(): BelongsTo
    {
        return $this->belongsTo(ItemType::class, 'inventory_type');
    }
    public function laboratory(): BelongsTo
    {
        return $this->belongsTo(Laboratory::class, 'laboratory');
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
