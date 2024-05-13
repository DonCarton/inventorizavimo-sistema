<?php

namespace App\Http\Controllers;

use App\Events\UserCreated;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
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
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        //echo $request;
        $query = Role::all()->toArray();

        return Inertia::render('Users/Create',[
            'roles' => $query
        ]);
//        return Inertia::render('Users/CreateTwo',[
//            'roles' => $query
//        ]);
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
            'selectedRole' => 'required',
        ]);
        $password = Str::random(10);
        $request['password'] = Hash::make($password);
        $request['name'] = $request['first_name'].' '.$request['last_name'];
//        if ($request['selectedRole'] == null) { redirect()->route('users.create')->with('failure', 'No role was chosen for the user'); }
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
        return Inertia::render('Users/Show',[
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('Users/Edit',[
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
