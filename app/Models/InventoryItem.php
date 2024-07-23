<?php

namespace App\Models;

use App\Enums\InventoryStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $inventory_type
 * @property int $amountLogs
 * @property int $itemType
 * @property string $local_name
 * @property int $laboratory
 * @property double $total_count
 * @property double $critical_amount
 * @method static findOrFail(int $id)
 * @method static create(mixed $data)
 * @method static where(string $string, string $string1, mixed $prefixOptionId)
 */
class InventoryItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'local_name',
        'inventory_type',
        'name',
        'name_eng',
        'formula',
        'cas_nr',
        'user_guide',
        'provider',
        'product_code',
        'barcode',
        'url_to_provider',
        'alt_url_to_provider',
        'total_count',
        'critical_amount',
        'to_order',
        'average_consumption',
        'multiple_locations',
        'laboratory',
        'cupboard',
        'shelf',
        'storage_conditions',
        'asset_number',
        'used_for',
        'comments',
        'created_by',
        'updated_by',
    ];
    public function itemType(): BelongsTo
    {
        return $this->belongsTo(ItemType::class, 'inventory_type');
    }
    public function getStatusAttribute(): string
    {
        $itemType = ItemType::where('id',$this->inventory_type)->select('change_acc_amount')->first();
        if ($itemType){
            $canChangeAmount = $itemType->change_acc_amount;
            if(!$canChangeAmount && $this->amountLogs()->count() > 0){
                return InventoryStatusEnum::TAKEN;
            }
            else if($canChangeAmount && $this->total_count <= $this->critical_amount){
                return InventoryStatusEnum::CRITICAL;
            }
        }
        return InventoryStatusEnum::NORMAL;
    }
    public function manyLaboratories(): HasMany
    {
        return $this->hasMany(Laboratory::class, 'id');
    }
    public function belongsToLaboratory(): BelongsTo
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
