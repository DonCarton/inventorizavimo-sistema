<?php

namespace App\Http\Controllers;

use App\Events\UserCreated;
use App\Exports\UserExports;
use App\Http\Resources\UserResource;
use App\Models\Laboratory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class UserController extends Controller
{
    public function __construct(public Laboratory $laboratory)
    {

    }
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $translations = [
            'user' => __('passwords.user')
        ];
        $query = User::query();
        $users = $query->paginate(10)->onEachSide(1);
        return Inertia::render('Users/Index',[
            'users' => UserResource::collection($users),
            'translations' => $translations,
            'success' => session('success'),
            'failure' => session('failure')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $query = Role::all()->toArray();
        return Inertia::render('Users/Create',[
            'roles' => $query
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'laboratory' => 'required',
            'selectedRole' => 'required',
        ]);
        $password = Str::random(10);
        $request['password'] = Hash::make($password);
        $request['name'] = $request['first_name'].' '.$request['last_name'];
        $newUser = User::create($request->all());
        $role = $request['selectedRole'];
        $newUser->assignRole($role);
        event(new UserCreated($newUser));
        return redirect()->route('users.index')->with('success', 'New user '. $request['email'].' has been created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        $query = Role::all()->toArray();
        $roleName = $user->roles()->select('name')->get()->toArray();
        $laboratories = Laboratory::all()->toArray();
        return Inertia::render('Users/Show',[
            'user' => new UserResource($user),
            'userRole' => $roleName,
            'roles' => $query,
            'laboratories' => $laboratories,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        $query = Role::all()->toArray();
        $roleName = $user->roles()->select('name')->get()->toArray();
        $laboratories = Laboratory::all()->select('id', 'name')->toArray();
        return Inertia::render('Users/Edit',[
            'user' => new UserResource($user),
            'userRole' => $roleName,
            'roles' => $query,
            'laboratories' => $laboratories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required',
            'laboratory' => 'required|integer',
            'role' => 'required'
        ]);
        $user->roles()->detach();
        $user->assignRole($data['role']);
        $user->update($data);
        return Redirect::route('users.index')->with('success',(__('actions.updated').'.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $userCount = User::query()->count();
        if ($userCount <= 1){
            return to_route('users.index')->with('failure','The record could not be deleted as there will be no users left.');
        }
        $user = User::findOrFail($id);
        $user->delete();
        return to_route('users.index')->with('success',(__('actions.deleted').'.'));
    }
    public function export(): BinaryFileResponse
    {
        return Excel::download(new UserExports(), 'users.xlsx');
    }
}
