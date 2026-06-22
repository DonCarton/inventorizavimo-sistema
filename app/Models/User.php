<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Observers\UserObserver;
use App\ValidAttributes;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;

/**
 * @method static findOrFail(int $id)
 * @method static create(array $all)
 * @method static where(string $string, mixed $input)
 * @property mixed $email
 * @property false|mixed $is_disable
 */
#[ObservedBy(UserObserver::class)]
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, LogsActivity, SoftDeletes, ValidAttributes;

    public const SYSTEM_EMAIL = 'system@internal.local';

    protected static ?self $systemUser = null;

    /**
     * The bootstrapped system user used as created_by/updated_by for actions
     * that aren't performed by a real, logged-in user (seeders, imports, jobs).
     */
    public static function system(): self
    {
        return static::$systemUser ??= static::where('email', self::SYSTEM_EMAIL)->firstOrFail();
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'password',
        'locale',
        'is_disabled',
        'created_by',
        'updated_by'
    ];

    protected static $recordEvents = ['created','updated','deleted'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public static function getImportUniqueBy(): array
    {
        return ['email'];
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function activities()
    {
        return $this->morphMany(Activity::class,'subject')->orderBy('created_at', 'desc');
    }

    public function getActivitylogOptions(): logOptions
    {
        return LogOptions::defaults()
            ->logOnly(['first_name','last_name','email'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "This model has been {$eventName}");
    }

    public function currentlyAssignedRole()
    {
        $role = $this->roles()->first();
        return $role?->name;
    }

    public function laboratories(): BelongsToMany
    {
        return $this->belongsToMany(Laboratory::class);
    }
    
    public function rolesForDisplay(): HasManyThrough
    {
        return $this->hasManyThrough(Role::class, ModelHasRole::class, 'model_id', 'id', 'id', 'role_id');
    }
    
    public function roleName()
    {
        return $this->rolesForDisplay->pluck('name')->implode(', ');
    }
    
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }
    
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by')->withTrashed();
    }

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class);
    }

    public function syncFacilitiesFromLaboratories(): void
    {
        $facilityIds = $this->laboratories()
            ->with('facilities')
            ->get()
            ->pluck('facilities')
            ->flatten()
            ->pluck('id')
            ->unique()
            ->all();

        $this->facilities()->sync($facilityIds);
    }

    public static function getImportForeignKeyLookups(): array
    {
        return [
            'laboratories' => [
                'table' => 'laboratories',
                'many_to_many' => true,
                'match_on' => 'name',
            ],
        ];
    }

}
