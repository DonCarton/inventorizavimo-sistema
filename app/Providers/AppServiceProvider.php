<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share('appLogoPath', env('APP_LOGO_PATH'));
        Inertia::share('appLogoPathColour', env('APP_LOGO_PATH_COLOUR'));
    }
}
