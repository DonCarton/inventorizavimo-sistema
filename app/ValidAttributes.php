<?php

namespace App;

use App\Enums\AttributeMerge;
use App\Interfaces\ImportableModel;
use Exception;

trait ValidAttributes
{
    protected static array $defaultDisclude = ['created_by', 'updated_by', 'created_at', 'updated_at', 'critical_amount_notified_at'];
    //TODO: Perhaps make it a bit better to fetch the translation
    protected static array $validTranslations = [
        'inventory_item' => 'InventoryItem',
    ];
    
    /**
     * Summary of fetchValidFields
     * @return void
     */
    public static function fetchValidFields(): array
    {
        if (!is_subclass_of(static::class, ImportableModel::class)) {
            throw new \LogicException(static::class . " does not implement ImportableModel.");
        }
        $instance = new static;
        $fillable = $instance->getFillable();
            
        $defaultDisclude = static::resolveDisclude($instance);

        return array_values(array_diff($fillable, $defaultDisclude));
    }

    public static function makeHumanReadable(array $attributesToTranslate, string $nameOfModel)
    {
        if (!$attributesToTranslate || !$nameOfModel){
            throw new Exception("Provided items are not correct is empty!", 422);
        }

        $correctFileName = array_search($nameOfModel, static::$validTranslations);
        $currentLoggedInUserLang = request()->user()->locale;
        $arrayOfTranslations = __($correctFileName,[],$currentLoggedInUserLang);
        
        $translatedArray = [];

        foreach ($attributesToTranslate as $key)
        {
            foreach ($arrayOfTranslations as $key2 => $value)
            {
                if($key == $key2)
                {
                    $translatedArray[$key] = $value;
                }
            }
        }
        
        return $translatedArray;
    }

    private static function resolveDisclude($instance): array
    {
        $modelDisclude = property_exists($instance, 'disclude') ? $instance->disclude : [];
        $mode = defined(get_class($instance) . '::DISCLUDE_MODE')
            ? $instance::DISCLUDE_MODE
            : AttributeMerge::MERGE;

        return match ($mode) {
            AttributeMerge::MERGE      => array_unique(array_merge(static::$defaultDisclude, $modelDisclude)),
            AttributeMerge::OVERRIDE   => $modelDisclude,
            AttributeMerge::TRAITONLY  => static::$defaultDisclude,
        };
    }
}
