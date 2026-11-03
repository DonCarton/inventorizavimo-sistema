<?php

namespace App\Models;

use App\Enums\InventoryStatusEnum;
use App\Enums\AttributeMerge;
use App\Events\AmountRunningLow;
use App\Interfaces\ImportableModel;
use App\Observers\InventoryItemObserver;
use App\Support\ItemCode;
use App\ValidAttributes;
use DateTime;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\LogOptions;

/**
 * @property int $id
 * @property int $inventory_type
 * @property int $amountLogs
 * @property ItemType $itemType
 * @property string $local_name
 * @property int|null $measurement_unit_id
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
        'measurement_unit_id',
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
        'multiple_locations',
        'laboratory',
        'cupboard',
        'shelf',
        'storage_conditions',
        'asset_number',
        'used_for',
        'comments',
        'critical_amount_notified_at',
        'min_loan_term_days',
        'max_loan_term_days',
        'created_by',
        'updated_by',
    ];

    public static function getImportableAttributes()
    {
        return [
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
            'multiple_locations',
            'laboratory',
            'facilities',
            'cupboard',
            'shelf',
            'storage_conditions',
            'asset_number',
            'used_for',
            'comments',
        ];
    }

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

    public function measurementUnit(): BelongsTo
    {
        return $this->belongsTo(MeasurementUnit::class);
    }

    public function consumptionLogs(): HasMany
    {
        return $this->hasMany(ConsumptionLog::class);
    }

    /** Average consumption and the usage chart both look at this many calendar months (incl. the current one). */
    public const CONSUMPTION_MONTHS = 12;

    public static function consumptionWindowStart(): Carbon
    {
        return now()->startOfMonth()->subMonths(self::CONSUMPTION_MONTHS - 1);
    }

    /**
     * Amount used per month over the last 12 months, rounded to the unit's decimals;
     * null when nothing was ever consumed. See averageMonthlyConsumptionFor().
     */
    public function averageMonthlyConsumption(): ?float
    {
        return static::averageMonthlyConsumptionFor(collect([$this]))[$this->id] ?? null;
    }

    /**
     * Average monthly consumption for many items with a single query: the amount used
     * in the window divided by the months counted. Months are counted from the item's
     * first consumption (or the window start, whichever is later) through the current
     * month, so an item first used this month is divided by 1, not 12.
     *
     * @param Collection<int, InventoryItem> $items
     * @return array<int, float|null> keyed by item id
     */
    public static function averageMonthlyConsumptionFor(Collection $items): array
    {
        if ($items->isEmpty()) {
            return [];
        }

        $windowStart = static::consumptionWindowStart();

        $stats = ConsumptionLog::query()
            ->whereIn('inventory_item_id', $items->pluck('id'))
            ->groupBy('inventory_item_id')
            ->selectRaw('inventory_item_id, SUM(CASE WHEN created_at >= ? THEN amount ELSE 0 END) AS window_sum, MIN(created_at) AS first_at', [$windowStart])
            ->get()
            ->keyBy('inventory_item_id');

        // Accept plain collections too (e.g. collect([$item])); units are needed for rounding.
        $items = (new EloquentCollection($items->all()))->loadMissing('measurementUnit');
        $currentMonth = now()->year * 12 + now()->month;

        return $items->mapWithKeys(function (InventoryItem $item) use ($stats, $windowStart, $currentMonth) {
            $row = $stats->get($item->id);
            if (!$row) {
                return [$item->id => null];
            }

            $start = Carbon::parse($row->first_at)->max($windowStart);
            $months = max(1, min(self::CONSUMPTION_MONTHS, $currentMonth - ($start->year * 12 + $start->month) + 1));

            return [$item->id => $item->roundAmount((float) $row->window_sum / $months)];
        })->all();
    }

    /**
     * Consumption per calendar month for the usage chart, oldest first, with months
     * without usage as 0: [['month' => '2026-03', 'amount' => 1.25], ...].
     */
    public function monthlyConsumption(): array
    {
        $windowStart = static::consumptionWindowStart();

        $byMonth = $this->consumptionLogs()
            ->where('created_at', '>=', $windowStart)
            ->get(['amount', 'created_at'])
            ->groupBy(fn(ConsumptionLog $log) => $log->created_at->format('Y-m'))
            ->map(fn($logs) => $logs->sum('amount'));

        return collect(range(0, self::CONSUMPTION_MONTHS - 1))
            ->map(function (int $offset) use ($windowStart, $byMonth) {
                $month = $windowStart->copy()->addMonths($offset)->format('Y-m');
                return ['month' => $month, 'amount' => $this->roundAmount((float) ($byMonth[$month] ?? 0))];
            })
            ->all();
    }

    /**
     * Rounds an amount to the decimals of this item's unit (3 when it has none).
     */
    public function roundAmount(float $value): float
    {
        return $this->measurementUnit ? $this->measurementUnit->round($value) : round($value, MeasurementUnit::MAX_DECIMAL_PLACES);
    }

    /**
     * Items saved without a unit (imports, factories, older code paths) are linked
     * to the unit whose code matches their code suffix, when there is one.
     */
    protected static function booted(): void
    {
        static::saving(function (InventoryItem $item) {
            if ($item->measurement_unit_id === null && ($unitCode = ItemCode::unitCode($item->local_name))) {
                $item->measurement_unit_id = MeasurementUnit::where('code', $unitCode)->value('id');
            }
        });
    }

    /*
     * @param InventoryItem
     * @return string
     */
    public function getStatusAttribute(): string
    {
        $amountRemoved = $this->amountLogs()->where('action', '=', 'REMOVE')->sum('amount');
        $amountReturned = $this->amountLogs()->where('action', '=', 'RETURN')->sum('amount');

        $totalPseudoAmount = $this->total_amount - ($amountRemoved - $amountReturned);

        if ($this->total_amount <= 0 || $this->total_amount === null || $this->total_amount <= $this->critical_amount || $totalPseudoAmount <= $this->critical_amount) {
            return InventoryStatusEnum::CRITICAL;
        }

        if ($this->amountLogs()->count() > 0) {
            return InventoryStatusEnum::TAKEN;
        }

        return InventoryStatusEnum::NORMAL;
    }

    protected static $recordEvents = ['created', 'updated'];

    public function activities()
    {
        return $this->morphMany(Activity::class, 'subject')->orderBy('created_at', 'desc');
    }

    public function getActivitylogOptions(): logOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logExcept(['created_at', 'updated_at', 'created_by', 'updated_by', 'critical_amount_notified_at'])
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
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }

    /*
     * @param InventoryItem
     * @return BelongsTo
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by')->withTrashed();
    }

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class)->orderBy('name');
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
                'many_to_many' => false,
                'match_on' => [
                    'name',
                    'ident_code',
                ],
            ],
            'inventory_type' => [
                'table' => 'item_types',
                'many_to_many' => false,
                'match_on' => 'name',
            ],
            'facilities' => [
                'table' => 'facilities',
                'many_to_many' => true,
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

    /**
     * Resolves the [min, max] loan-term day range that gates the free-text `term` field on
     * AmountLog borrows, if any. Order: off entirely unless the global `loan_term_limits_enabled`
     * SystemConfiguration is on; then this item's own min/max override; then its ItemType's
     * default; else null (no constraint — term stays free text). Meaningless (and always null)
     * for item types with change_acc_amount = true — those items never go through the
     * borrow/return AmountLog flow at all, only direct total_amount edits.
     * @return array{0: int, 1: int}|null
     */
    public function loanTermRange(): ?array
    {
        if ($this->itemType?->change_acc_amount) {
            return null;
        }

        if (!SystemConfiguration::isEnabled('loan_term_limits_enabled')) {
            return null;
        }

        if (!is_null($this->min_loan_term_days) || !is_null($this->max_loan_term_days)) {
            return [$this->min_loan_term_days ?? 0, $this->max_loan_term_days ?? PHP_INT_MAX];
        }

        $itemType = $this->itemType;
        if ($itemType && (!is_null($itemType->min_loan_term_days) || !is_null($itemType->max_loan_term_days))) {
            return [$itemType->min_loan_term_days ?? 0, $itemType->max_loan_term_days ?? PHP_INT_MAX];
        }

        return null;
    }

    /**
     * Shared by InventoryItemObserver (direct total_amount edits) and AmountLogObserver
     * (take-out/return log flow) so the critical-amount notification rule lives in one place.
     */
    public function evaluateCriticalAmount(float $remainingAmount, bool $notificationsEnabled): void
    {
        if ($remainingAmount <= $this->critical_amount && is_null($this->critical_amount_notified_at)) {
            if ($notificationsEnabled) {
                event(new AmountRunningLow($this));
            }
            $this->critical_amount_notified_at = now();
            $this->saveQuietly();
        } elseif ($remainingAmount > $this->critical_amount && !is_null($this->critical_amount_notified_at)) {
            $this->critical_amount_notified_at = null;
            $this->saveQuietly();
        }
    }

}
