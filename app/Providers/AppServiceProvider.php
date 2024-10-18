<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
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
        Gate::define('overrule-all', function (User $user) {
            return $user->hasRole('super-admin');
        });
        Inertia::share('appLogoPath', env('APP_LOGO_PATH'));
        Inertia::share('appLogoPathColour', env('APP_LOGO_PATH_COLOUR'));
    }
}
