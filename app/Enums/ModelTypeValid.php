<?php

namespace App\Enums;

enum ModelTypeValid: string
{
    case InventoryItem = "inventory_item";
    case ItemType = "item_type";
    case Laboratory = "laboratory";
    case User = "user";

    public static function fromStringCaseInsensitive(string $value): ?self
    {
        foreach(self::cases() as $case)
        {
            if (strcasecmp($case->value, $value) === 0)
            {
                return $case;
            }
        }
        return null;
    }

}
