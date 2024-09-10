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
        if (strcasecmp(config('app.env'), 'local') != 0) {
            return redirect()->back();
        }

        // $query = SystemConfiguration::query()->get();

        // $stringValues = $query->whereNotNull("string_value")->select(['key','name','string_value']);
        // $intValues = $query->whereNotNull("integer_value")->select(['key','name','integer_value']);
        // $booleanValues = $query->whereNull("string_value")->whereNull("integer_value")->select(['key','name','boolean_value']);

        // return Inertia::render('Admin/Edit', [
        //     'systemConfiguration' => SystemConfigurationIndexResource::collection($query),
        //     'data' => [
        //         'stringValues' => $stringValues,
        //         'intValues' => $intValues,
        //         'booleanValues' => $booleanValues,
        //     ],
        //     'failure' => session('failure'),
        // ]);
        $systemConfiguration = SystemConfiguration::all()->groupBy('category');
        return Inertia::render('Admin/Edit', [
            'systemConfiguration' => $systemConfiguration,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        return Redirect::route('systemConfigurations.index')->with('failure', 'Veiksmas neleistinas.');
    }
}
