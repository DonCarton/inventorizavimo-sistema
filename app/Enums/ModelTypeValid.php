<?php

namespace App\Enums;

enum ModelTypeValid: string
{
    case InventoryItem = "inventory_item";
    case ItemType = "item_type";
    case Laboratory = "Laboratory";
    case User = "User";
}
