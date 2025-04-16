<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;
use Illuminate\Translation\PotentiallyTranslatedString;

class ExistsByNumericOrString implements ValidationRule
{
    protected string $table;
    protected string $idColumn;
    protected string $nameColumn;
    protected string $translationKey;

    public function __construct(string $table, string $attributeName = 'default', string $idColumn = 'id', string $nameColumn = 'name')
    {
        $this->table = $table;
        $this->idColumn = $idColumn;
        $this->nameColumn = $nameColumn;
        $this->translationKey = 'validation.custom.' . $attributeName . '.no_valid_record';
    }
    /**
     * Run the validation rule.
     *
     * @param Closure(string, ?string=): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (is_numeric($value)){
            DB::table($this->table)->where($this->idColumn, $value)->exists() ?: $fail(__($this->translationKey));
        } elseif(is_string($value)){
            DB::table($this->table)->where($this->nameColumn, $value)->exists() ?: $fail(__($this->translationKey));
        }
    }
}
