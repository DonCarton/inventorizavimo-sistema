<?php
namespace App\Imports\Helpers;

use App\Rules\ExistsInPivotRelation;
use Illuminate\Support\Facades\Config;

class ImportHelper
{
    /**
     * @param string $modelClass
     * @param array $baseRules
     * @param array $rowInput
     * @return array Final rules with dynamic logic injected
     */
    public static function buildRowValidationRules(string $modelClass, array $baseRules, array $rowInput): array
    {
        $customPivotConfig = static::getPivotConfigFor($modelClass);

        $finalRules = [];

        foreach ($baseRules as $field => $rulesForField) {
            $finalRules[$field] = [];
            foreach ($rulesForField as $rule) {
                
                if (is_string($rule) && str_starts_with($rule, 'pivot')) {
                    
                    [$pivotTable, $relatedKey] = explode(',', $rule);

                    $relatedValue = $rowInput[$relatedKey] ?? null;

                    $pivotTable = $customPivotConfig[$field]['pivot'];
                    $primaryTable = $customPivotConfig[$field]['primary_table'];
                    $secondaryTable = $customPivotConfig[$field]['secondary_table'];
                    $pivotPrimaryKey = $customPivotConfig[$field]['primary_key'];
                    $pivotSecondaryKey = $customPivotConfig[$field]['secondary_key'];

                    $finalRules[$field][] = new ExistsInPivotRelation(
                        relatedAttributeName: $field,
                        relatedAttributeValue: $relatedValue,
                        pivotTable: $pivotTable,
                        primaryTable: $primaryTable,
                        secondaryTable: $secondaryTable,
                        pivotPrimaryKey: $pivotPrimaryKey,
                        pivotRelatedKey: $pivotSecondaryKey,
                    );
                } else {
                    $finalRules[$field][] = $rule;
                }

            }
        }
        
        return $finalRules;
    }

    /**
     * Optionally defined per model to indicate how to interpret fields like "facility"
     */
    public static function getPivotConfigFor(string $modelClass): array
    {
        return Config::get("import_pivot_rules.{$modelClass}", []);
    }
}
