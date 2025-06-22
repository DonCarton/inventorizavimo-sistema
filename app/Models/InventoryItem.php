<?php

namespace App\Models;

use App\Enums\InventoryStatusEnum;
use App\Enums\AttributeMerge;
use App\Interfaces\ImportableModel;
use App\Observers\InventoryItemObserver;
use App\ValidAttributes;
use DateTime;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\LogOptions;

/**
 * @property int $id
 * @property int $inventory_type
 * @property int $amountLogs
 * @property ItemType $itemType
 * @property string $local_name
 * @property int $laboratory
 * @property double $total_amount
 * @property double $critical_amount
 * @property DateTime $critical_amount_notified_at
 * @method static findOrFail(int $id)
 * @method static create(mixed $data)
 * @method static where(string $string, string $operator, mixed $value)
 */
#[ObservedBy(InventoryItemObserver::class)]
class InventoryItem extends Model implements ImportableModel
{
    use HasFactory, LogsActivity, ValidAttributes;
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
        'total_amount',
        'critical_amount',
        'to_order_amount',
        'average_consumption',
        'multiple_locations',
        'laboratory',
        'cupboard',
        'shelf',
        'storage_conditions',
        'asset_number',
        'used_for',
        'comments',
        'critical_amount_notified_at',
        'created_by',
        'updated_by',
    ];

    public const DISCLUDE_MODE = AttributeMerge::TRAITONLY;

    public static function getImportUniqueBy(): array
    {
        return ['local_name'];
    }

    /*
     * @param InventoryItem
     * @return BelongsTo
     */
    public function itemType(): BelongsTo
    {
        return $this->belongsTo(ItemType::class, 'inventory_type');
    }

    /*
     * @param InventoryItem
     * @return string
     */
    public function getStatusAttribute(): string
    {
        $amountRemoved = $this->amountLogs()->where('action','=','REMOVE')->sum('amount');
        $amountReturned = $this->amountLogs()->where('action','=','RETURN')->sum('amount');

        $totalPseudoAmount = $this->total_amount - ($amountRemoved - $amountReturned);

        if ($this->total_amount <= 0 || $this->total_amount === null || $this->total_amount <= $this->critical_amount || $totalPseudoAmount <= $this->critical_amount)
        { return InventoryStatusEnum::CRITICAL; }

        if ($this->amountLogs()->count() > 0)
        { return InventoryStatusEnum::TAKEN; }

        return InventoryStatusEnum::NORMAL;
    }

    protected static $recordEvents = ['created','updated'];

    public function activities()
    {
        return $this->morphMany(Activity::class,'subject')->orderBy('created_at', 'desc');
    }

    public function getActivitylogOptions(): logOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logExcept(['created_at','updated_at','created_by','updated_by','critical_amount_notified_at'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "This model has been {$eventName}");
    }

    /*
     * @param InventoryItem
     * @return HasMany
     */
    public function manyLaboratories(): HasMany
    {
        return $this->hasMany(Laboratory::class, 'id');
    }

    /*
     * @param InventoryItem
     * @return BelongsTo
     */
    public function belongsToLaboratory(): BelongsTo
    {
        return $this->belongsTo(Laboratory::class, 'laboratory');
    }

    /*
     * @param InventoryItem
     * @return BelongsTo
     */
    public  function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }

    /*
     * @param InventoryItem
     * @return BelongsTo
     */
    public  function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by')->withTrashed();
    }

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class);
    }

    /*
     * @return HasMany
     */
    public function amountLogs(): HasMany
    {
        return $this->hasMany(AmountLog::class, 'inventory_item_id');
    }

    /**
     * Summary of getImportForeignKeyLookups
     * Method is used to retrieve how the model's references can be mapped.
     * @return array
     */
    public static function getImportForeignKeyLookups(): array
    {
        return [
            'laboratory' => [
                'table' => 'laboratories',
                'match_on' => [
                    'name',
                    'ident_code',
                ],
            ],
            'inventory_type' => [
                'table' => 'item_types',
                'match_on' => 'name',
            ],
        ];
    }

    public static function resolveForeignKey(string $attribute, string $value): ?int
    {
        $lookup = static::getImportForeignKeyLookups()[$attribute] ?? null;

        if (!$lookup) {
            return null;
        }

        return \DB::table($lookup['table'])
            ->where($lookup['match_on'], $value)
            ->value('id');
    }

}
