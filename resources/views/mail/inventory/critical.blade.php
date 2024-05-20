<x-mail::message xmlns:x-mail="http://www.w3.org/1999/html">
Sveiki {{$user->first_name}},

Inventorius įrašas ** {{$inventoryItem->local_name}} ** pasiekė kritinį kiekį, prašome užsakyti jo daugiau arba peržvelgti turimą kiekį.<br>


<x-mail::button url="{{ route('inventoryItems.editRaw',$inventoryItem->id) }}">
Pasiekti įrašą dabar
</x-mail::button>

Dėkojame, <br>
{{config('app.name')}}
</x-mail::message>
