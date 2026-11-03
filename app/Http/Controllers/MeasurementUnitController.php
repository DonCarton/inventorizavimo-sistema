<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRequests\StoreMeasurementUnitRequest;
use App\Http\Requests\UpdateRequests\UpdateMeasurementUnitRequest;
use App\Http\Resources\MeasurementUnitResource;
use App\Models\MeasurementUnit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MeasurementUnitController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', MeasurementUnit::class);

        $units = MeasurementUnit::query()
            ->withCount('inventoryItems')
            ->with('updatedBy')
            ->orderBy('code')
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('MeasurementUnits/Index', [
            'measurementUnits' => MeasurementUnitResource::collection($units),
            'success' => session('success'),
            'warning' => session('warning'),
            'can' => [
                'update' => request()->user()->can('update', new MeasurementUnit()),
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', MeasurementUnit::class);

        return Inertia::render('MeasurementUnits/Create');
    }

    public function store(StoreMeasurementUnitRequest $request): RedirectResponse
    {
        Gate::authorize('create', MeasurementUnit::class);

        $unit = MeasurementUnit::create($request->validated());

        return to_route('measurementUnits.index')
            ->with('success', __('actions.measurementUnit.created', ['code' => $unit->code]));
    }

    /**
     * Read-only details, for everyone who may view units (also those who can't edit them).
     */
    public function show(MeasurementUnit $measurementUnit): Response
    {
        Gate::authorize('viewAny', MeasurementUnit::class);

        $measurementUnit->loadCount('inventoryItems');

        return Inertia::render('MeasurementUnits/Show', [
            'measurementUnit' => new MeasurementUnitResource($measurementUnit),
            'can' => [
                'update' => request()->user()->can('update', $measurementUnit),
            ],
        ]);
    }

    public function edit(MeasurementUnit $measurementUnit): Response
    {
        Gate::authorize('update', $measurementUnit);

        $measurementUnit->loadCount('inventoryItems');

        return Inertia::render('MeasurementUnits/Edit', [
            'measurementUnit' => new MeasurementUnitResource($measurementUnit),
            'can' => [
                'delete' => request()->user()->can('delete', $measurementUnit),
            ],
        ]);
    }

    /**
     * Changing the code only affects items created afterwards: existing item codes
     * keep their suffix (printed labels stay valid) and stay linked by id.
     */
    public function update(UpdateMeasurementUnitRequest $request, MeasurementUnit $measurementUnit): RedirectResponse
    {
        Gate::authorize('update', $measurementUnit);

        $measurementUnit->update($request->validated());

        return to_route('measurementUnits.index')
            ->with('success', __('actions.measurementUnit.updated', ['code' => $measurementUnit->code]));
    }

    public function destroy(MeasurementUnit $measurementUnit): RedirectResponse
    {
        Gate::authorize('delete', $measurementUnit);

        $itemCount = $measurementUnit->inventoryItems()->count();

        if ($itemCount > 0) {
            return to_route('measurementUnits.index')
                ->with('warning', __('actions.measurementUnit.still_related', ['count' => $itemCount]));
        }

        $measurementUnit->delete();

        return to_route('measurementUnits.index')
            ->with('success', __('actions.measurementUnit.deleted', ['code' => $measurementUnit->code]));
    }
}
