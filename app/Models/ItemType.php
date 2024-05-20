<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static create(\Illuminate\Http\Request $request)
 * @method static where(string $string, mixed $inventory_type)
 * @method static findOrFail(int $id)
 */
class ItemType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'change_acc_amount',
        'created_by',
        'updated_by'
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
