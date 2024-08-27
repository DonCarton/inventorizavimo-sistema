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
    public function index(Request $request)
    {
        if (strcasecmp(config('app.env'), 'Local') != 0) {
            return redirect()->back();
        }

        $query = SystemConfiguration::query()->get();

        $stringValues = $query->whereNotNull("string_value")->select(['key','name','string_value']);
        $intValues = $query->whereNotNull("integer_value")->select(['key','name','integer_value']);
        $booleanValues = $query->whereNull("string_value")->whereNull("integer_value")->select(['key','name','boolean_value']);

        return Inertia::render('Admin/Edit', [
            'systemConfiguration' => SystemConfigurationIndexResource::collection($query),
            'data' => [
                'stringValues' => $stringValues,
                'intValues' => $intValues,
                'booleanValues' => $booleanValues,
            ]
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $whatsHere = $request->user()->fill($request->validated());
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }
}
