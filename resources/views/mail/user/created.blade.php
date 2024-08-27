<x-mail::message xmlns:x-mail="http://www.w3.org/1999/html">
{{ __('messages.Hello', ['name' => $user->first_name]) }},

**{{ __('messages.Users.Here are your login credentials for the system') }}** <br><br>
{{ __('messages.Users.Email to login') }}: **{{$user->email}}**<br>
{{ __('messages.Users.Password to login') }}: **{{$password}}**


<x-mail::button url="{{ route('login') }}">
{{ __('messages.Users.Login') }}
</x-mail::button>

{{ __('messages.Regards') }}, <br>
{{config('app.name')}}
</x-mail::message>
