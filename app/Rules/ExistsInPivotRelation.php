<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ExistsInPivotRelation implements ValidationRule
{
    protected string $primaryTable;
    
    protected string $secondaryTable;
    
    protected string $primaryNameColumn;
    
    protected string $primaryIdColumn;
    
    protected string $secondaryNameColumn;

    protected string $secondaryIdColumn;

    protected string $pivotTable;
    
    protected string $pivotPrimaryKey;
    
    protected string $pivotRelatedKey;

    protected string $relatedAttributeName;
    
    protected mixed $relatedAttributeValue;

    protected string $translationKey = 'validation.custom.relation.not_existing';

    public function __construct(
        string $primaryTable,
        string $secondaryTable,
        ?string $relatedAttributeName,
        mixed $relatedAttributeValue,
        string $pivotTable,
        string $pivotPrimaryKey,
        string $pivotRelatedKey,
        string $primaryIdColumn = 'id',
        string $primaryNameColumn = 'name',
        string $secondaryIdColumn = 'id',
        string $secondaryNameColumn = 'name'
        )
    {
        $this->primaryTable = $primaryTable;
        $this->primaryIdColumn = $primaryIdColumn;
        $this->primaryNameColumn = $primaryNameColumn;

        $this->secondaryTable = $secondaryTable;
        $this->secondaryIdColumn = $secondaryIdColumn;
        $this->secondaryNameColumn = $secondaryNameColumn;

        $this->pivotTable = $pivotTable;
        $this->pivotPrimaryKey = $pivotPrimaryKey;
        $this->pivotRelatedKey = $pivotRelatedKey;

        $this->relatedAttributeName = $relatedAttributeName;
        if ($relatedAttributeName) {
            $this->translationKey = "validation.custom.relation.{$relatedAttributeName}.not_existing";
        }
        $this->relatedAttributeValue = $relatedAttributeValue;
    }
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $values = str_contains($value, '|') ? explode('|', $value) : [$value];

        foreach ($values as $val) {
            $val = trim($val);
            
            $primaryId = is_numeric($val)
                ? \DB::table($this->primaryTable)->where($this->primaryIdColumn, $val)->value('id')
                : \DB::table($this->primaryTable)->where($this->primaryNameColumn, $val)->value('id');

            if (!$primaryId) {
                $fail(__('validation.exists', ['value' => $val]));
                continue;
            }
            
            $secondaryId = is_numeric($this->relatedAttributeValue)
                ? \DB::table($this->secondaryTable)->where($this->secondaryIdColumn, $this->relatedAttributeValue)->value('id')
                : \DB::table($this->secondaryTable)->where($this->secondaryNameColumn, $this->relatedAttributeValue)->value('id');

            $exists = \DB::table($this->pivotTable)
                ->where($this->pivotPrimaryKey, $primaryId)
                ->where($this->pivotRelatedKey, $secondaryId)
                ->exists();

            if (!$exists) {
                $fail(__($this->translationKey, ['value1' => $val, 'value2' => $this->relatedAttributeValue]));
            }
        }
    }
}
