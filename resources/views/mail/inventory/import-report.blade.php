<x-mail::message xmlns:x-mail="http://www.w3.org/1999/html">
{{ __('messages.Hello', ['name' => $user->first_name]) }},

{{ __('messages.Import.Failed imports') }}<br>

{{ __('messages.Regards') }}, <br>
{{config('app.name')}}
</x-mail::message>
