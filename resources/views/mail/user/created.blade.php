<x-mail::message xmlns:x-mail="http://www.w3.org/1999/html">
<!-- Sveiki {{$user->first_name}}, -->
{{ __('messages.Hello', ['name' => $user->first_name]) }},

**{{ __('messages.Here are your login credentials for the system') }}** <br>
{{ __('messages.Email to login', ['email' => $user->email]) }}<br>
Slaptaždois: {{$password}}


<x-mail::button url="{{ route('login') }}">
Prisijungti
</x-mail::button>

Dėkojame, <br>
{{config('app.name')}}
</x-mail::message>
