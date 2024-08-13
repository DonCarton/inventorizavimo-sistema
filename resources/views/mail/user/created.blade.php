<x-mail::message xmlns:x-mail="http://www.w3.org/1999/html">
Sveiki {{$user->first_name}},

**Štai jūsų prisijungimo duomenys prie sistemos** <br>
El. paštas: {{$user->email}}<br>
Slaptaždois: {{$password}}


<x-mail::button url="{{ route('login') }}">
Prisijungti
</x-mail::button>

Dėkojame, <br>
{{config('app.name')}}
</x-mail::message>
