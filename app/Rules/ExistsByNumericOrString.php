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
    protected bool $allowPipeSeparated;

    public function __construct(string $table, string $attributeName = 'default', string $idColumn = 'id', string $nameColumn = 'name', $allowPipeSeparated = false)
    {
        $this->table = $table;
        $this->idColumn = $idColumn;
        $this->nameColumn = $nameColumn;
        $this->translationKey = 'validation.custom.' . $attributeName . '.no_valid_record';
        $this->allowPipeSeparated = $allowPipeSeparated;
    }
    /**
     * Run the validation rule.
     *
     * @param Closure(string, ?string=): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $values = $this->allowPipeSeparated && str_contains($value, '|')
            ? explode('|', $value)
            : [$value];
            
        foreach ($values as $val) {
            $val = trim($val);

            $found = is_numeric($val)
                ? DB::table($this->table)->where($this->idColumn, $val)->exists()
                : DB::table($this->table)->where($this->nameColumn, $val)->exists();

            if (!$found) {
                $fail(__($this->translationKey, ['value' => $val]));
            }
        }
    }
}
