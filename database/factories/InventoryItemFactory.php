<?php

namespace Database\Factories;

use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventoryItem>
 */
class InventoryItemFactory extends Factory
{
    protected $model = InventoryItem::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $index = 0;
        $prefixes = ["BIO","CHE","FIZ","FAB","PRO","ROB","SVI","INZ","BEN"];
        $postfixes = ['P', 'L', 'K'];

        $prefix = $prefixes[intdiv($index, 999) % count($prefixes)];
        $suffixNumber = str_pad(($index % 999) + 1, 3, '0', STR_PAD_LEFT);
        $postfix = $this->faker->randomElement($postfixes);
        $inventoryTypes = [1, 2, 3, 4, 5];
        $index++;

        $nameValue = $this->faker->words($this->faker->randomElement([1, 2, 3, 4, 5]),true);
        return [
            'local_name' => $prefix . $suffixNumber . '-' . $postfix,
            'inventory_type' => $this->faker->randomElement($inventoryTypes),
            'name' => $nameValue,
            'name_eng' => $nameValue,
            'formula' => $this->faker->regexify('[A-Z0-9]{8}'),
            'cas_nr' => $this->faker->regexify('[A-Z0-9]{6}'),
            'user_guide' => $this->faker->text(50),
            'provider' => $this->faker->company,
            'product_code' => $this->faker->regexify('[A-Z0-9]{8}'),
            'barcode' => $this->faker->ean13(),
            'url_to_provider' => $this->faker->url(),
            'alt_url_to_provider' => $this->faker->url(),
            'total_amount' => $this->faker->randomDigitNotZero(),
            'critical_amount' => $this->faker->randomDigitNotZero(),
            'multiple_locations' => $this->faker->boolean(),
            'laboratory' => 1,
            'storage_conditions' => $this->faker->text(50),
            'asset_number' => $this->faker->uuid,
            'used_for' => $this->faker->text(50),
            'comments' => $this->faker->text(50),
            'created_by' => 1,
            'updated_by' => 1,
        ];
    }
}
