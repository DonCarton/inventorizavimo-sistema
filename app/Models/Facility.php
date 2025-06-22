<?php

namespace App\Models;

use App\Models\InventoryItem;
use App\Models\Laboratory;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Facility extends Model
{

    protected $fillable = [
        'name',
        'created_by',
        'updated_by'
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by')->withTrashed();
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
    
    public function laboratories(): BelongsToMany
    {
        return $this->belongsToMany(Laboratory::class);
    }

    public function inventoryItems(): BelongsToMany
    {
        return $this->belongsToMany(InventoryItem::class);
    }

    /**
     * @return int
     */
    public function inventoryItemsCount():int
    {
        return $this->inventoryItems()->count();
    }

    /**
     * @return int
     */
    public function usersCount():int
    {
        return $this->users()->count();
    }

}
