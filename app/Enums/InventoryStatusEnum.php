<?php

namespace App\Enums;

enum InventoryStatusEnum: string
{
    const CRITICAL = "critical";
    const NORMAL = "normal";
    const TAKEN = "taken";
}
