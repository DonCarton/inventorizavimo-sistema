<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PhpParser\Node\Expr\AssignOp\Mod;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;

/**
 * @method static findOrFail(int $id)
 * @method static create(array $all)
 * @method static where(string $string, mixed $input)
 * @property mixed $email
 * @property false|mixed $is_disable
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, LogsActivity;

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
        'laboratory',
        'created_by',
        'updated_by'
    ];

    protected static $recordEvents = ['created','updated'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

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

    public function getActivitylogOptions(): logOptions
    {
        return LogOptions::defaults()
            ->logOnly(['first_name','last_name','email'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "This model has been {$eventName}");
    }

    public function belongsToLaboratory(): BelongsTo
    {
        return $this->belongsTo(Laboratory::class, 'laboratory');
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
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }


}
