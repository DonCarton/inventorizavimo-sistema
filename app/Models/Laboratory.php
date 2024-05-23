<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static create(array $all)
 * @method static where(string $string, mixed $laboratory)
 * @method static findOrFail(int $id)
 */
class Laboratory extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'created_by',
        'updated_by'
    ];
    public  function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public  function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
