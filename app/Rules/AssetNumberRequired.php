<?php

namespace App\Rules;

use App\Models\ItemType;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class AssetNumberRequired implements ValidationRule
{
    protected bool $canChangeAmount;
    protected string $typeName;
    public function __construct(ItemType $type){
        $this->canChangeAmount = $type->change_acc_amount;
        $this->typeName = $type->name;
    }
    /**
     * Run the validation rule.
     *
     * @param Closure(string): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if(!$this->canChangeAmount && $value == ''){
            $fail(__('validation.custom.asset_number.custom_asset_validation',['name' => $this->typeName]));
        }
        else if($this->canChangeAmount && $value != ''){
            $fail(__('validation.custom.asset_number.custom_asset_still_exists',['name' => $this->typeName]));
        }
    }
}
