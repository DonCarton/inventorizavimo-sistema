<?php

namespace App\Http\Controllers\Admin;

use App\Http\Resources\IndexResources\SystemConfigurationIndexResource;
use App\Models\SystemConfiguration;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class SystemConfigurationController extends Controller
{
    public function edit()
    {
        if (strcasecmp(config('app.env'), string2: 'local') != 0) {
            return redirect()->back();
        }

        $systemConfiguration = SystemConfiguration::all()->groupBy('category');
        $myConfigurations = SystemConfiguration::with('value')->get()->groupBy('category');
        return Inertia::render('Admin/Edit', [
            'systemConfiguration' => $systemConfiguration,
            'myConfigurations' => $myConfigurations,
            'success' => session('success'),
            'failure' => session('failure')
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        return to_route('systemConfigurations.edit')->with('failure', __('actions.denied'));
    }
}
