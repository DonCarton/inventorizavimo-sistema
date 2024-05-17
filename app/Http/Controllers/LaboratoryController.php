<?php

namespace App\Http\Controllers;

use App\Exports\LaboratoryExports;
use App\Http\Resources\LaboratoryResource;
use App\Http\Resources\LaboratoryResourceForMulti;
use App\Imports\LaboratoryImport;
use App\Models\Laboratory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class LaboratoryController extends Controller
{
    public function index(): Response
    {
        $query = Laboratory::query();
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');
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
    public function export(): BinaryFileResponse
    {
        return Excel::download(new LaboratoryExports(), 'laboratories.xlsx');
    }
    public function import(Request $request): RedirectResponse
    {
        $request->validate([
           'file' => 'file|mimetypes:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/excel'
        ]);
        $file = $request->file('file');
        Excel::import(new LaboratoryImport(), $file);
        return to_route('laboratories.index')->with('success','Uploaded successfully');
    }
}
