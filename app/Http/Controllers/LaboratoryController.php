<?php

namespace App\Http\Controllers;

use App\Http\Resources\LaboratoryResource;
use App\Http\Resources\LaboratoryResourceForMulti;
use App\Models\Laboratory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class LaboratoryController extends Controller
{
    public function index(): Response
    {
        $query = Laboratory::query();
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');

        if (request('local_name')){
            $query->where('local_name','like','%'.request('local_name').'%');
        }
        if (request('name')){
            $query->where('name','like','%'.request('name').'%');
        }
        if (request('updated_by')){
            $query->whereHas('createdBy', function ($query) {
                $query->where('email', 'like', '%'.request('updated_by').'%');
            });
        }

        $laboratories = $query->orderBy($sortField, $sortDirection)->paginate(15)->withQueryString()->onEachSide(1);
        return Inertia::render('Laboratory/Index',[
            'laboratories' => LaboratoryResource::collection($laboratories),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }
    public function show(Laboratory $laboratory): Response
    {
        return Inertia::render('Laboratory/Show',[
            'laboratory' => new LaboratoryResource($laboratory)
        ]);
    }
    public function create(): Response
    {
        return Inertia::render('Laboratory/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|min:3|max:255',
        ]);
        $request['created_by'] = auth()->user()->id;
        $request['updated_by'] = auth()->user()->id;
        Laboratory::create($request->all());
        return redirect()->route('laboratories.index')->with('success', 'New laboratory '. $request['name'].' has been created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Laboratory $laboratory): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|min:3|max:50',
        ]);
        $laboratory->update($data);
        return Redirect::route('laboratories.index')->with('success',(__('actions.updated').'.'));
    }
    public function edit(Laboratory $laboratory): Response
    {
        return Inertia::render('Laboratory/Edit',[
            'laboratory' => new LaboratoryResource($laboratory)
        ]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $laboratory = Laboratory::findOrFail($id);
        $laboratory->delete();
        return to_route('laboratories.index')->with('success',(__('actions.deleted').'.'));
    }
}
