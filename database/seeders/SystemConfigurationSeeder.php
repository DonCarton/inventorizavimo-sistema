<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SystemConfiguration;
use App\Models\ConfigurationValue;

class SystemConfigurationSeeder extends Seeder
{
    public function run(): void
    {
        $defaultConfigurations = [
            ['key' => 'cupboard_range', 'name' => 'Spintų numeracija', 'value_type' => 'string', 'category' => 'general', 'default_value' => '1-20'],
            ['key' => 'shelf_range', 'name' => 'Lentynų numeracija', 'value_type' => 'string', 'category' => 'general', 'default_value' => 'A-Z'],
        ];

        foreach ($defaultConfigurations as $config) {
            $configuration = SystemConfiguration::firstOrCreate(
                ['key' => $config['key']],
                ['name' => $config['name'], 'value_type' => $config['value_type'], 'category' => $config['category']]
            );

            ConfigurationValue::firstOrCreate(
                ['configuration_id' => $configuration->id],
                ['value' => $config['default_value']]
            );
        }
    }
}
