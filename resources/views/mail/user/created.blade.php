<x-mail::message xmlns:x-mail="http://www.w3.org/1999/html">
Hello {{$user->first_name}},
**Here is your login information** <br>
Email: {{$user->email}}


<x-mail::button url="{{ route('login') }}">
Click here to login
</x-mail::button>

Thank you, <br>
{{config('app.name')}}
</x-mail::message>
