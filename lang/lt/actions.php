<?php

return [

    'created' => 'Sukurtas',
    'updated' => 'Atnaujintas',
    'deleted' => 'Ištrintas',
    'saved' => 'Išsaugotas',
    'uploaded' => [
        'success' => 'Failas [:name] buvo sėkmingai importuotas!',
        'not_fully' => 'Failas pilnai neįsikėlė, paštu gausite klaidų raportą.'
    ],
    'user' => [
        'created' => 'Naujas naudotojas [:email] sukurtas.',
        'updated' => 'Naudotojas [:email] atnaujintas.',
        'activated' => 'Naudotojas [:email] atblokuotas.',
        'deactivated' => 'Naudotojas [:email] užblokuotas.',
        'deleted' => 'Naudotojas [:email] sėkmingai ištrintas.',
        'selfDelete' => 'Ištrinti savo paskyros negalima.',
        'selfDeactivate' => 'Užblokuoti savęs negalite.',
        'noUsersLeft' => 'Ištrinti paskutinio naudotojo, nes nebeliks aktyvių naudotojų.',
        'deletedUser' => 'Ištrintas naudotojas'
    ],
    'laboratory' => [
        'created' => 'Nauja laboratorija :name sukurta.',
        'updated' => 'Laboratorija [:name] atnaujinta.',
        'deleted' => 'Laboratorija [:name] sėkmingai ištrinta.'
    ],
    'inventoryItem' => [
        'created' => 'Naujas įrašas [:local_name] sukurtas.',
        'logged' => 'Atskiras įrašas [:local_name] sekti inventorių sukurtas.',
        'updated' => 'Įrašas [:local_name] atnaujintas.',
        'deleted' => 'Įrašas [:local_name] ištrintas.',
        'volumeMismatch' => 'Pateiktas kiekis grąžinti viršija konstatuotą faktą, kiek yra inventoriaus šioje lokacijoje.'
    ],
    'itemType' => [
        'created' => 'Naujas tipas [:name] sukurtas.',
        'updated' => 'Tipas [:name] atnaujintas.',
        'deleted' => 'Tipas [:name] sėkmingai ištrintas.',
        'still_related' => 'Tipas yra priskirtas inventoriaus įrašams [:count]. Ištrinti negalima.'
    ],
    'systemConfiguration' => [
        'updated' => 'Nustatymas pakeistas sėkmingai.'
    ],
    'noItemFound' => 'Kodas atpažintas [:name], bet įrašas nerastas.',
    'true' => 'Taip',
    'false' => 'Ne',
    'denied' => 'Veiksmas neleistinas.',
    'invalidDelete' => 'Ištrinti šio įrašo negalima.',
    'imports' => [
        'row' => 'eilutė faile',
        'value' => 'reikšmė',
        'field' => 'laukas',
        'error_type' => 'klaidos tipas',
        'error_message' => 'klaidos žinutė',
        'issue_types' => [
            'empty' => 'tuščia eilutė',
            'validation' => 'duomenų tiklsumas',
            'exception' => 'išimtis',
        ],
    ],

];
