<x-mail::message xmlns:x-mail="http://www.w3.org/1999/html">
{{ __('messages.Hello', ['name' => $user->first_name]) }},

<!-- Inventoriaus įrašas **{{$inventoryItem->local_name}}** pasiekė kritinį kiekį, prašome užsakyti jo daugiau arba peržvelgti turimą kiekį.<br> -->
{!! __('messages.Inventory.Inventory item is too low or changed', ['localName' => $inventoryItem->local_name]) !!}<br>

<x-mail::button url="{{ route('inventoryItems.editRaw',$inventoryItem->id) }}">
{{ __('messages.View entry') }}
</x-mail::button>

{{ __('messages.Regards') }}, <br>
{{config('app.name')}}
</x-mail::message>
