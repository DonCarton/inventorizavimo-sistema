<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class HasRelationMethod implements ValidationRule
{
    protected string $modelClass;
    protected string $relationName;

    public function __construct(string $modelClass, string $relationName){
        $this->modelClass = $modelClass;
        $this->relationName = $relationName;
    }
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!method_exists($this->modelClass, $this->relationName)) {
            $fail(__('validation.custom.relation_missing', [
                'relation' => $this->relationName,
                'model' => class_basename($this->modelClass)
            ]));
        }
    }
}
