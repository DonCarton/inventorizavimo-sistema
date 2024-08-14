<?php

namespace App\Models;

use App\Observers\AmountLogObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static create(array $array)
 * @method static where(string $string, mixed $id)
 * @property InventoryItem $inventoryItem
 */
#[ObservedBy(AmountLogObserver::class)]
class AmountLog extends Model
{
    use HasFactory;
    protected $fillable = [
        'inventory_item_id',
        'laboratory_id',
        'action',
        'amount',
        'comment',
        'created_by',
        'updated_by'
    ];
    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }
    public function laboratory(): BelongsTo
    {
        return $this->belongsTo(Laboratory::class, 'laboratory_id');
    }
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
