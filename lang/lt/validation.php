<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */
    'unauthorized_admin' => 'Tik super administratoriai gali atlikti šį veiksmą.',
    'unauthorized' => 'Tik administratoriai gali atlikti šį veiksmą.',
    'accepted' => 'The :attribute field must be accepted.',
    'accepted_if' => 'The :attribute field must be accepted when :other is :value.',
    'active_url' => 'The :attribute field must be a valid URL.',
    'after' => 'The :attribute field must be a date after :date.',
    'after_or_equal' => 'The :attribute field must be a date after or equal to :date.',
    'alpha' => 'The :attribute field must only contain letters.',
    'alpha_dash' => 'The :attribute field must only contain letters, numbers, dashes, and underscores.',
    'alpha_num' => 'The :attribute field must only contain letters and numbers.',
    'array' => 'The :attribute field must be an array.',
    'ascii' => 'The :attribute field must only contain single-byte alphanumeric characters and symbols.',
    'before' => 'The :attribute field must be a date before :date.',
    'before_or_equal' => 'The :attribute field must be a date before or equal to :date.',
    'between' => [
        'array' => 'The :attribute field must have between :min and :max items.',
        'file' => 'The :attribute field must be between :min and :max kilobytes.',
        'numeric' => 'Pateikta reikšmė neatitinka rėžių, :min ir :max.',
        'string' => 'The :attribute field must be between :min and :max characters.',
    ],
    'boolean' => ':Attribute laukelis turi būti pažymėtas.',
    'can' => 'The :attribute field contains an unauthorized value.',
    'confirmed' => 'The :attribute field confirmation does not match.',
    'current_password' => 'Slaptažodis neteisingas.',
    'date' => 'The :attribute field must be a valid date.',
    'date_equals' => 'The :attribute field must be a date equal to :date.',
    'date_format' => 'The :attribute field must match the format :format.',
    'decimal' => 'The :attribute field must have :decimal decimal places.',
    'declined' => 'The :attribute field must be declined.',
    'declined_if' => 'The :attribute field must be declined when :other is :value.',
    'different' => 'The :attribute field and :other must be different.',
    'digits' => 'The :attribute field must be :digits digits.',
    'digits_between' => 'The :attribute field must be between :min and :max digits.',
    'dimensions' => 'The :attribute field has invalid image dimensions.',
    'distinct' => 'The :attribute field has a duplicate value.',
    'doesnt_end_with' => 'The :attribute field must not end with one of the following: :values.',
    'doesnt_start_with' => 'The :attribute field must not start with one of the following: :values.',
    'email' => 'The :attribute field must be a valid email address.',
    'ends_with' => 'The :attribute field must end with one of the following: :values.',
    'enum' => 'The selected :attribute is invalid.',
    'exists' => 'Pateikta reikšmė nėra tinkama.',
    'extensions' => 'The :attribute field must have one of the following extensions: :values.',
    'file' => 'The :attribute field must be a file.',
    'filled' => 'The :attribute field must have a value.',
    'gt' => [
        'array' => 'The :attribute field must have more than :value items.',
        'file' => 'The :attribute field must be greater than :value kilobytes.',
        'numeric' => 'The :attribute field must be greater than :value.',
        'string' => 'The :attribute field must be greater than :value characters.',
    ],
    'gte' => [
        'array' => 'The :attribute field must have :value items or more.',
        'file' => 'The :attribute field must be greater than or equal to :value kilobytes.',
        'numeric' => 'Reikšmė turi būti didesnė arba lygi :value.',
        'string' => 'The :attribute field must be greater than or equal to :value characters.',
    ],
    'hex_color' => 'The :attribute field must be a valid hexadecimal color.',
    'image' => 'The :attribute field must be an image.',
    'in' => 'The selected :attribute is invalid.',
    'in_array' => 'The :attribute field must exist in :other.',
    'integer' => 'The :attribute field must be an integer.',
    'ip' => 'The :attribute field must be a valid IP address.',
    'ipv4' => 'The :attribute field must be a valid IPv4 address.',
    'ipv6' => 'The :attribute field must be a valid IPv6 address.',
    'json' => 'The :attribute field must be a valid JSON string.',
    'list' => 'The :attribute field must be a list.',
    'lowercase' => 'The :attribute field must be lowercase.',
    'lt' => [
        'array' => 'The :attribute field must have less than :value items.',
        'file' => 'The :attribute field must be less than :value kilobytes.',
        'numeric' => ':Attribute turi būti mažesnis negu :value.',
        'string' => 'The :attribute field must be less than :value characters.',
    ],
    'lte' => [
        'array' => 'The :attribute field must not have more than :value items.',
        'file' => 'The :attribute field must be less than or equal to :value kilobytes.',
        'numeric' => 'Reikšmė turi būti mažesnė arba lygi :value.',
        'string' => 'The :attribute field must be less than or equal to :value characters.',
    ],
    'mac_address' => 'The :attribute field must be a valid MAC address.',
    'max' => [
        'array' => 'The :attribute field must not have more than :max items.',
        'file' => 'The :attribute field must not be greater than :max kilobytes.',
        'numeric' => 'The :attribute field must not be greater than :max.',
        'string' => ':Attribute privalo būti mažesnis nei :max simbolių.',
    ],
    'max_digits' => 'The :attribute field must not have more than :max digits.',
    'mimes' => 'The :attribute field must be a file of type: :values.',
    'mimetypes' => 'The :attribute field must be a file of type: :values.',
    'min' => [
        'array' => 'The :attribute field must have at least :min items.',
        'file' => ':Attribute laukas turi būti :min kilobaitų.',
        'numeric' => 'The :attribute field must be at least :min.',
        'string' => ':Attribute privalo būti daugiau nei :min simboliai.',
    ],
    'min_digits' => 'The :attribute field must have at least :min digits.',
    'missing' => 'The :attribute field must be missing.',
    'missing_if' => 'The :attribute field must be missing when :other is :value.',
    'missing_unless' => 'The :attribute field must be missing unless :other is :value.',
    'missing_with' => 'The :attribute field must be missing when :values is present.',
    'missing_with_all' => 'The :attribute field must be missing when :values are present.',
    'multiple_of' => 'The :attribute field must be a multiple of :value.',
    'not_in' => 'The selected :attribute is invalid.',
    'not_regex' => 'Reikšmė nėra tinkama.',
    'numeric' => 'Reikšmė turi būti skaitinė (0-9).',
    'password' => [
        'letters' => 'The :attribute field must contain at least one letter.',
        'mixed' => 'The :attribute field must contain at least one uppercase and one lowercase letter.',
        'numbers' => 'The :attribute field must contain at least one number.',
        'symbols' => 'The :attribute field must contain at least one symbol.',
        'uncompromised' => 'The given :attribute has appeared in a data leak. Please choose a different :attribute.',
    ],
    'present' => 'The :attribute field must be present.',
    'present_if' => 'The :attribute field must be present when :other is :value.',
    'present_unless' => 'The :attribute field must be present unless :other is :value.',
    'present_with' => 'The :attribute field must be present when :values is present.',
    'present_with_all' => 'The :attribute field must be present when :values are present.',
    'prohibited' => 'The :attribute field is prohibited.',
    'prohibited_if' => 'The :attribute field is prohibited when :other is :value.',
    'prohibited_unless' => 'The :attribute field is prohibited unless :other is in :values.',
    'prohibits' => 'The :attribute field prohibits :other from being present.',
    'regex' => 'Reikšmė nėra tinkama.',
    'required' => ':Attribute yra privalomas laukas.',
    'required_array_keys' => 'The :attribute field must contain entries for: :values.',
    'required_if' => ':attribute yra privalomas jeigu :other yra :value.',
    'required_if_accepted' => 'The :attribute field is required when :other is accepted.',
    'required_if_declined' => 'The :attribute field is required when :other is declined.',
    'required_unless' => 'The :attribute field is required unless :other is in :values.',
    'required_with' => 'The :attribute field is required when :values is present.',
    'required_with_all' => 'The :attribute field is required when :values are present.',
    'required_without' => ':Attribute yra privalomas, jeigu :values nėra įvestas.',
    'required_without_all' => 'The :attribute field is required when none of :values are present.',
    'same' => 'The :attribute field must match :other.',
    'size' => [
        'array' => 'The :attribute field must contain :size items.',
        'file' => 'The :attribute field must be :size kilobytes.',
        'numeric' => 'The :attribute field must be :size.',
        'string' => 'The :attribute field must be :size characters.',
    ],
    'starts_with' => 'The :attribute field must start with one of the following: :values.',
    'string' => ':Attribute turi būti tekstinės vertės.',
    'timezone' => 'The :attribute field must be a valid timezone.',
    'unique' => 'Ši reikšmė jau užimta.',
    'uploaded' => 'The :attribute failed to upload.',
    'uppercase' => ':Attribute turi būti didžiosimis raidėmis.',
    'url' => 'The :attribute field must be a valid URL.',
    'ulid' => 'The :attribute field must be a valid ULID.',
    'uuid' => 'The :attribute field must be a valid UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'relation' => [
            'not_existing' => 'Ši patalpa nėra susieta su laboratorija.',
            'facilities' => [
                'not_existing' => 'Pateikta patalpa [:value1] nepriklauso šio įrašo laboratorijai [:value2].',
            ],
        ],
        'file' => [
            'required' => 'Importo failas yra privalomas.' 
        ],
        'field_mappings' => [
            'required' => 'Bent vienas importavimo laukas turi būti nurodytas.',
        ],
        'asset_number' => [
            'custom_asset_validation' => ':Attribute negali būti tuščias, jeigu pasirinktas tipas yra \':Name.\'',
            'custom_asset_still_exists' => ':Attribute turi būti tuščias, jeigu pasirinktas tipas yra \':Name.\'',
        ],
        'name' => [
            'required' => 'Pavadinimas yra privalomas.',
        ],
        'name_eng' => [
            'required' => 'Angliškas pavadinimas (:Attribute) yra privalomas.',
        ],
        'cupboard' => [
            'exists' => 'Pasirinkta spinta nėra tinkamas objektas šitam laukeliui.'
        ],
        'shelf' => [
            'exists' => 'Pasirinkta lentyna nėra tinkamas objektas šitam laukeliui.'
        ],
        'inventory_type' => [
            'required' => 'Pasirinkti inventoriaus tipą yra privaloma.',
            'no_valid_record' => ':Attribute su pateikta reikšme [:value] nerastas.',
        ],
        'per_page' => [
            'min' => 'Norimas gauti kiekis įrašų turi būti lygus arba didesnis nei :min.',
            'max' => 'Norimas gauti kiekis įrašų turi būti lygus arba mažesnis nei :max.'
        ],
        'amount' => [
            'min' => [
                'numeric' => 'Kiekis turi būti lygus arba didesnis nei :min.',
            ],
            'lte'  => [
                'numeric' => 'Turimas kiekis bazinėje vietoje yra mažesnis nei bandoma išimti. Prieinamas kiekis: :value.',
            ],
        ],
        'amount_removed' => [
            'lt' => [
                'numeric' => ':Attribute turi būti mažesnis negu esamas kiekis inventoriuje (:value).',
            ],
            'non_negative' => ':Attribute negali viršyti esamo kiekio, jog jis taptų neigiamas.'
        ],
        'selectedRole' => [
            'can' => 'Tik super administratoriai gali suteikti šią rolę.',
            'unauthorized_role_change' => 'Rolės pakeisti negalite.',
        ],
        'value' => [
            'range_alphabetical' => 'Pateikta reikšmė yra netinkama. Naudokite A-F arba A-J.',
            'range_numeric' => 'Pateikta reikšmė yra netinkama. Naudokite 1-10 arba 1-20.',
            'range_generic' => 'Pateikta reikšmė yra netinkama.',
        ],
        'laboratory' => [
            'no_valid_record' => ':Attribute su pateikta reikšme [:value] nerasta.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'file' => 'failas',
        'field_mappings' => 'importavimo laukai',
        'local_name' => 'vietinis pavadinimas',
        'model_class' => 'įrašo tipas',
        'inventory_type' => 'tipas',
        'name' => 'pavadinimas',
        'name_eng' => 'pavadinimas ENG',
        'formula' => 'formulė',
        'cas_nr' => 'CAS NR',
        'user_guide' => 'SDL/naudojimo instrukcijos',
        'provider' => 'tiekėjas',
        'product_code' => 'prekės kodas',
        'barcode' => 'barkodas',
        'total_amount' => 'kiekis',
        'critical_amount' => 'kritinis kiekis',
        'to_order_amount' => 'užsakyti',
        'multiple_locations' => 'keliose vietose?',
        'storage_conditions' => 'laikymo sąlygos',
        'asset_number' => 'turto numeris',
        'used_for' => 'naudojimas',
        'comments' => 'komentarai',
        'amount_removed' => 'išimamas kiekis',
        'amount_added' => 'įdedamas kiekis',
        'amount' => 'kiekis',
        'laboratory_id' => 'laboratorija',
        'first_name' => 'vardas',
        'last_name' => 'pavardė',
        'email' => 'el. paštas',
        'laboratory' => 'laboratorija',
        'facilities' => 'patalpa',
        'role' => 'rolė',
        'selectedRole' => 'rolė',
        'comment' => 'komentaras',
        'change_acc_amount' => 'gali literaliai keisti likutį?',
        'cupboard' => 'spinta',
        'shelf' => 'lentyna',
        'per_page' => 'įrašų kiekis per puslapį',
        'object_type' => 'objekto tipas',
        'critical_amount_notified_at' => 'pranešimas apie stygių išsiųstas laiku',
        'value' => 'reikšmė',
        'ident_code' => 'atpažinimo kodas',
        '*.inventory_type' => 'tipas',
        '*.laboratory' => 'laboratorija',
        '*.cupboard' => 'spinta',
        '*.shelf' => 'lentyna',
        '*.critical_amount' => 'kritinis kiekis',
        '*.to_order' => 'užsakyti',
        '*.average_consumption' => 'vidutiniškai sunaudojama',
        '*.facilities' => 'patalpa',
    ],

];
