<?php

namespace App\Http\Controllers\Admin;

use App\Http\Resources\IndexResources\SystemConfigurationIndexResource;
use App\Models\ConfigurationValue;
use App\Models\SystemConfiguration;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class SystemConfigurationController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        $systemConfiguration = SystemConfiguration::all()->groupBy("category");
        $myConfigurations = SystemConfiguration::with("value")
            ->get()
            ->groupBy("category");
        return Inertia::render("Admin/Index", [
            "systemConfiguration" => $systemConfiguration,
            "myConfigurations" => $myConfigurations,
            "success" => session("success"),
            "failure" => session("failure"),
        ]);
    }
    public function edit(): Response|RedirectResponse
    {
        if (strcasecmp(config("app.env"), string2: "local") != 0) {
            return redirect()->back();
        }

        $systemConfiguration = SystemConfiguration::all()->groupBy("category");
        $myConfigurations = SystemConfiguration::with("value")
            ->get()
            ->groupBy("category");
        return Inertia::render("Admin/Edit", [
            "systemConfiguration" => $systemConfiguration,
            "myConfigurations" => $myConfigurations,
            "success" => session("success"),
            "failure" => session("failure"),
        ]);
    }

    public function update(
        SystemConfiguration $systemConfiguration,
        Request $request,
    ): JsonResponse|RedirectResponse {
        $configurationValue = ConfigurationValue::findOrFail(
            $systemConfiguration->id,
        );

        $validated = $request->validate([
            "value" => [
                "required",
                "string",
                function ($attribute, $value, $fail) use ($configurationValue) {
                    if (
                        str_contains(
                            $configurationValue->configuration->key,
                            "_range",
                        )
                    ) {
                        if (
                            !$this->isValidRange(
                                $value,
                                $configurationValue->configuration->key,
                            )
                        ) {
                            if (
                                $configurationValue->configuration->key ===
                                "cupboard_range"
                            ) {
                                $fail(
                                    __(
                                        "validation.custom.value.range_alphabetical",
                                    ),
                                );
                            } elseif (
                                $configurationValue->configuration->key ===
                                "shelf_range"
                            ) {
                                $fail(
                                    __("validation.custom.value.range_numeric"),
                                );
                            }
                            $fail(__("validation.custom.value.range_generic"));
                        }
                    }
                },
            ],
        ]);

        $configurationValue->update($validated);
        return to_route("systemConfigurations.index");
    }
    private function isValidRange($range, $key): bool
    {
        $rangeParts = explode("-", $range);
        if (count($rangeParts) !== 2) {
            return false;
        }

        [$start, $end] = $rangeParts;

        if ($key === "cupboard_range") {
            return $start === "A" && ctype_alpha($end) && $start <= $end;
        } elseif ($key === "shelf_range") {
            return $start == 1 && ctype_digit($end) && $start <= $end;
        }

        return false;
    }
}
