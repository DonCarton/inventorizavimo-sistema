<?php

namespace App\Http\Controllers;

use App\Http\Resources\LaboratoryResource;
use App\Models\Laboratory;
use Illuminate\Http\JsonResponse;
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
            $query->where('updated_by','like','%'.request('updated_by').'%');
        }

        $laboratories = $query->orderBy($sortField, $sortDirection)->paginate(3)->onEachSide(1);
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
}
