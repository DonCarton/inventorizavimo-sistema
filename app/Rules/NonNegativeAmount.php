<?php

namespace App\Rules;

use App\Models\InventoryItem;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Log;
use Illuminate\Translation\PotentiallyTranslatedString;

/**
 *
 */
class NonNegativeAmount implements ValidationRule
{
    protected float $totalAmount;
    public function __construct(float $totalAmount){
        $this->totalAmount = $totalAmount;
    }

    /**
     * Run the validation rule.
     * @param string $attribute
     * @param mixed $value
     * @param Closure(string): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if($this->totalAmount - $value < 0){
            $fail(__('validation.custom.amount_removed.non_negative'));
        }
    }
}
