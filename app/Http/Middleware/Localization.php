<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class Localization
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->user()->locale ?? config('app.locale');
//        if ($request->user() == null){
//            $locale = 'en';
//        }
//        else {
//            $locale = $request->user()->locale;
//        }
        //dd($locale);
        $request->session()->put('locale', $locale);
        $setLocale = $request->session()->get('locale');
        App::setLocale($setLocale);
        //app()->setLocale($request->segment(1));
        return $next($request);
    }
}
