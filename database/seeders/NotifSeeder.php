<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SystemConfiguration;
use App\Models\ConfigurationValue;
use Spatie\Permission\Models\Role;

class NotifSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultConfiguration = [
            'key' => 'critical_notification',
            'name' => 'Siųsti kritinio kiekio pranešimus sistemos administratoriams?',
            'value_type' => 'boolean',
            'category' => 'general',
            'default_value' => 0
        ];

        $configuration = SystemConfiguration::firstOrCreate(
            [
                'key' => $defaultConfiguration['key']
            ],
            [
                'name' => $defaultConfiguration['name'],
                'value_type' => $defaultConfiguration['value_type'],
                'category' => $defaultConfiguration['category']
            ]
        );

        ConfigurationValue::firstOrCreate(
                ['configuration_id' => $configuration->id],
                ['value' => $defaultConfiguration['default_value']]
        );

        $testRole = [
            'id' => 4,
            'name' => 'test',
            'guard_name' => 'web',
        ];
        Role::firstOrCreate($testRole);
    }
}
