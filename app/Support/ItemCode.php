<?php

namespace App\Support;

/**
 * Inventory item codes look like ŠVIE102-P: laboratory prefix, a running number
 * (at least 3 digits) and, after a dash, the code of the item's measurement unit.
 */
class ItemCode
{
    // D modifier: '$' is the real end of the string (otherwise it also matches before a trailing newline).
    public const PATTERN = '/^\p{Lu}{1,4}\d{3,}-\p{Lu}{1,3}$/uD';

    public const UNIT_CODE_PATTERN = '/^\p{Lu}{1,3}$/uD';

    /**
     * The unit suffix of a code (the part after the last dash), or null when there is none.
     */
    public static function unitCode(?string $code): ?string
    {
        if ($code === null || !preg_match('/-(\p{Lu}{1,3})$/uD', $code, $matches)) {
            return null;
        }

        return $matches[1];
    }

    /**
     * The code with its unit suffix replaced by (or, if it has none, extended with) the given unit code.
     */
    public static function withUnit(string $code, string $unitCode): string
    {
        $base = preg_replace('/-\p{Lu}{1,3}$/uD', '', $code);

        return "{$base}-{$unitCode}";
    }
}
