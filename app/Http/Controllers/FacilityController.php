<?php

namespace App\Http\Controllers;

use App\Http\Resources\FacilityResource;
use App\Models\Facility;
use App\Models\Laboratory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class FacilityController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Facility::class);
        $query = Facility::query();
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');
        if (request('name')){
            $query->where('name','like','%'.request('name').'%');
        }
        if (request('updated_by')){
            $query->whereHas('updatedBy', function ($query) {
                $query->where('email', 'like', '%'.request('updated_by').'%');
            });
        }
        $facilities = $query->orderBy($sortField, $sortDirection)->paginate(10)->withQueryString()->onEachSide(1);
        return Inertia::render('Facility/Index',[
            'facilities' => FacilityResource::collection($facilities),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function create()
    {
        return Inertia::render(
            'Facility/Create',
        );
    }

    public function store(Request $request)
    {
        $request['created_by'] = auth()->user()->id;
        $request['updated_by'] = auth()->user()->id;

        $data = $request->validate([
            'name' => ['required', 'min:2', 'max:255'],
            'created_by' => ['required', 'exists:users,id'],
            'updated_by' => ['required', 'exists:users,id'],
        ]);

        $facility = Facility::create($data);

        return to_route('facilities.index')->with('success',(__('actions.facility.created', ['name' => $facility->name])));
    }

    public function show(Facility $facility)
    {
        $laboratories = Laboratory::select('id', 'name')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function($laboratory){
                return [
                    'value' => $laboratory->id,
                    'label' => $laboratory->name,
                ];
            })
            ->toArray();
        return Inertia::render(
            'Facility/Show', [
                'facility' => new FacilityResource($facility),
                'laboratories' => $laboratories,
            ]
        );
    }

    public function edit(Facility $facility)
    {
        $laboratories = Laboratory::select('id', 'name')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function($laboratory){
                return [
                    'value' => $laboratory->id,
                    'label' => $laboratory->name,
                ];
            })
            ->toArray();
        return Inertia::render(
            'Facility/Edit', [
                'facility' => new FacilityResource($facility),
                'laboratories' => $laboratories,
                'can' => [
                    'setLaboratory' => request()->user()->can('setLaboratory', $facility),
                    'delete' => request()->user()->can('delete', $facility),
                ] 
            ]
        );
    }

    public function update(Request $request, Facility $facility)
    {
        Gate::authorize('update',$facility);

        $request['updated_by'] = auth()->user()->id;
        $data = $request->validate([
            'name' => ['required', 'min:2', 'max:255'],
            'laboratory' => ['required', 'exists:laboratories,id'],
            'updated_by' => ['required', 'exists:users,id'],
        ]);
        $facility->update($data);

        $laboratoriesChanged = false;

        if(request()->user()->can('setLaboratory', $facility)){
            
            $oldFacilities = $facility->laboratories->pluck('id')->toArray();
            $facility->laboratories()->sync($data['laboratory']);
            $laboratoriesChanged = $oldFacilities != $data['laboratory'];

        }
        
        if ($facility->wasChanged() || $laboratoriesChanged) {
            return to_route('facilities.index')->with('success',(__('actions.facility.updated', ['name' => $request['name']])));
        }
        return to_route('facilities.index');
    }
    
    public function destroy(Facility $facility)
    {
        Gate::authorize('delete',$facility);

        $totalFacilities = Facility::count();

        if ($totalFacilities <= 1) {
            return to_route('facilities.index')->with('failure', __('actions.invalidDelete'));
        }

        $facility->delete();
        return to_route('facilities.index')->with('success',(__('actions.facility.deleted', ['name' => $facility['name']])));
    }

    public function deleteImpact(Facility $facility)
    {
        return response()->json([
            'impactCounts' => [
                'inventoryItems' => $facility->inventoryItemsCount(),
                'users' => $facility->usersCount(),
            ],
            'labels' => [
                'inventoryItems' => $facility->inventoryItemsCount() > 1 ? __('objects.labels.plural.inventoryItem') : __('objects.labels.singular.inventoryItem'),
                'users' => $facility->usersCount() > 1 ? __('objects.labels.plural.user') : __('objects.labels.singular.user'),
            ]
        ]);
    }
}
