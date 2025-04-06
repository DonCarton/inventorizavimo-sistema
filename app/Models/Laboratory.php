<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * @method static create(array $all)
 * @method static where(string $string, mixed $laboratory)
 * @method static findOrFail(int $id)
 * @method static find(int $id)
 */
class Laboratory extends Model
{
    use HasFactory, LogsActivity;
    protected $fillable = [
        'name',
        'ident_code',
        'created_by',
        'updated_by'
    ];
    protected static $recordEvents = ['created','updated'];
    public function activities()
    {
        return $this->morphMany(Activity::class,'subject')->orderBy('created_at', 'desc');
    }
    public function getActivitylogOptions(): logOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "This model has been {$eventName}");
    }

    public function inventoryItems(): HasMany
    {
        return $this->hasMany(InventoryItem::class,'laboratory');
    }

    /**
     * @return int
     */
    public function inventoryItemsCount():int
    {
        return $this->inventoryItems()->count();
    }
    public function users(): HasMany
    {
        return $this->hasMany(User::class,'laboratory');
    }
    public function userCount():int
    {
        return $this->users()->count();
    }
    public  function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }
    public  function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by')->withTrashed();
    }
}
