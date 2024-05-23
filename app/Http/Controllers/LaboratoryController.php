<?php

namespace App\Http\Controllers;

use App\Exports\LaboratoryExports;
use App\Http\Resources\LaboratoryResource;
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
    /**
     * @return Response
     */
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
        $laboratories = $query->orderBy($sortField, $sortDirection)->paginate(10)->withQueryString()->onEachSide(1);
        return Inertia::render('Laboratory/Index',[
            'laboratories' => LaboratoryResource::collection($laboratories),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'warning' => session('warning')
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
        return Inertia::render('Laboratory/Create');
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|min:3|max:255',
        ]);
        Laboratory::create($request->all());
        return redirect()->route('laboratories.index')->with('success', __('actions.laboratory.created', ['name' => $request['name']]) . '.');
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param Laboratory $laboratory
     * @return RedirectResponse
     */
    public function update(Request $request, Laboratory $laboratory): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|min:3|max:50',
        ]);
        $laboratory->update($data);
        return Redirect::route('laboratories.index')->with('success',(__('actions.laboratory.updated', ['name' => $request['name']]).'.'));
    }

    /**
     * @param Laboratory $laboratory
     * @return Response
     */
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
        return to_route('laboratories.index')->with('warning',(__('actions.laboratory.deleted', ['name' => $laboratory['name']]).'.'));
    }

    /**
     * @return BinaryFileResponse
     */
    public function export(): BinaryFileResponse
    {
        return Excel::download(new LaboratoryExports(), 'laboratories.xlsx');
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
        Excel::import(new LaboratoryImport(), $file);
        return to_route('laboratories.index')->with('success',__('actions.uploaded') . '!');
    }
}
