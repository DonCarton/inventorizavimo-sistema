<?php

namespace App\Http\Controllers;

use App\Exports\LaboratoryExports;
use App\Http\Requests\StoreRequests\StoreLaboratoryRequest;
use App\Http\Requests\UpdateRequests\UpdateLaboratoryRequest;
use App\Http\Resources\LaboratoryResource;
use App\Imports\LaboratoryImport;
use App\Jobs\NotifyFailedImports;
use App\Models\Facility;
use App\Models\Laboratory;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class LaboratoryController extends Controller
{
    /**
     * @return Response
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', Laboratory::class);
        $query = Laboratory::query();
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');
        if (request('name')){
            $query->where('name','like','%'.request('name').'%');
        }
        if (request('ident_code')){
            $query->where('ident_code','like','%'.request('ident_code').'%');
        }
        if (request('updated_by')){
            $query->whereHas('updatedBy', function ($query) {
                $query->where('email', 'like', '%'.request('updated_by').'%');
            });
        }
        $laboratories = $query->orderBy($sortField, $sortDirection)->paginate(10)->withQueryString()->onEachSide(1);
        return Inertia::render('Laboratory/Index',[
            'laboratories' => LaboratoryResource::collection($laboratories),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'warning' => session('warning'),
            'failure' => session('failure')
        ]);
    }

    /**
     * @param Laboratory $laboratory
     * @return Response
     */
    public function show(Laboratory $laboratory): Response
    {
        return Inertia::render('Laboratory/Show',[
            'laboratory' => new LaboratoryResource($laboratory)
        ]);
    }

    /**
     * @return Response
     */
    public function create(): Response
    {
        $facilities = Facility::select('id', 'name')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function($facility){
                return [
                    'value' => $facility->id,
                    'label' => $facility->name,
                ];
            })
            ->toArray();

        return Inertia::render('Laboratory/Create',[
            'facilities' => $facilities,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(StoreLaboratoryRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $newLab = Laboratory::create($data);
        $newLab->facilities()->sync($data['facility']);
        
        return redirect()->route('laboratories.index')->with('success', __('actions.laboratory.created', ['name' => $request['name']]));
    }

    /**
     * Update the specified resource in storage.
     * @param UpdateLaboratoryRequest $request
     * @param Laboratory $laboratory
     * @return RedirectResponse
     */
    public function update(UpdateLaboratoryRequest $request, Laboratory $laboratory): RedirectResponse
    {
        $data = $request->validated();
        $oldFacilities = $laboratory->facilities->pluck('id')->toArray();

        $laboratory->update($data);
        $laboratory->facilities()->sync($data['facility']);

        $facilitiesChanged = $oldFacilities != $data['facility'];

        if ($laboratory->wasChanged() || $facilitiesChanged) {
            return Redirect::route('laboratories.index')->with('success',(__('actions.laboratory.updated', ['name' => $request['name']])));
        }
        return Redirect::route('laboratories.index');
    }

    /**
     * @param Laboratory $laboratory
     * @return Response
     */
    public function edit(Laboratory $laboratory): Response
    {
        $facilities = Facility::select('id', 'name')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function($facility){
                return [
                    'value' => $facility->id,
                    'label' => $facility->name,
                ];
            })
            ->toArray();
        return Inertia::render('Laboratory/Edit',[
            'laboratory' => new LaboratoryResource($laboratory),
            'facilities' => $facilities,
            'can' => [
                'delete' => request()->user()->can('delete', $laboratory),
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    //TODO: MAKE SURE THAT THE LAB DELETES PROPERLY IF THERE ARE ITEMS LINKED TO IT DIRECTLY ON THEIR TABLES,
    //LIKE USERS, INVENTORY ITEMS
    public function destroy(Laboratory $laboratory): RedirectResponse
    {
        Gate::authorize('delete',$laboratory);
        
        if ($laboratory->id == 1) { return to_route('laboratories.index')->with('failure', __('actions.invalidDelete')); }
        
        if ($laboratory->inventoryItemsCount() >= 1 || $laboratory->userCount() >= 1) {
            return to_route('laboratories.index')->with('failure', __('actions.invalidDelete'));
        }

        $totalLaboratories = Laboratory::count();
        if ($totalLaboratories <= 1) {
            return to_route('laboratories.index')->with('failure', __('actions.invalidDelete'));
        }
        
        $laboratory->delete();
        return to_route('laboratories.index')->with('success',(__('actions.laboratory.deleted', ['name' => $laboratory['name']])));
    }

    public function deleteImpact(Laboratory $laboratory)
    {
        return response()->json([
            'impactCounts' => [
                'inventoryItems' => $laboratory->inventoryItemsCount(),
                'facilities' => $laboratory->facilitiesCount(),
                'users' => $laboratory->userCount(),
            ],
            'labels' => [
                'inventoryItems' => $laboratory->inventoryItemsCount() > 1 ? __('objects.labels.plural.inventoryItem') : __('objects.labels.singular.inventoryItem'),
                'facilities' => $laboratory->facilitiesCount() > 1 ? __('objects.labels.plural.facility') : __('objects.labels.singular.facility'),
                'users' => $laboratory->userCount() > 1 ? __('objects.labels.plural.user') : __('objects.labels.singular.user'),
            ]
        ]);
    }

    /**
     * @return BinaryFileResponse
     */
    public function export(): BinaryFileResponse
    {
        $dateTimeNow = Carbon::now('Europe/Vilnius')->toDateTimeString();
        return Excel::download(new LaboratoryExports(), $dateTimeNow .  '_laboratories_export.xlsx');
    }

    /**
     * @param Request $request
     * @return RedirectResponse
     */
    public function import(Request $request): RedirectResponse
    {
        $request->validate([
           'file' => 'file|mimetypes:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/excel'
        ]);
        $file = $request->file('file');
        $fileName = $request->file('file')->getClientOriginalName();

        $import = new LaboratoryImport();
        Excel::import($import, $file);
        
        if (!empty($import->caughtFailures))
        {
            NotifyFailedImports::dispatch($import->caughtFailures, auth()->user());
            return to_route('laboratories.index')->with('failure', __('actions.uploaded.not_fully', ['name' => $fileName]));
        }

        return to_route('laboratories.index')->with('success',__('actions.uploaded.success', ['name' => $fileName]));
    }
}
