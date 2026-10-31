<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * An amount used up from a consumable inventory item (recorded on "remove").
 *
 * @property int $inventory_item_id
 * @property float $amount
 */
class ConsumptionLog extends Model
{
    protected $fillable = [
        'inventory_item_id',
        'amount',
        'created_by',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }
}
