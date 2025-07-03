<?php

namespace App\Http\Controllers;

use App\Events\UserCreated;
use App\Exports\UserExports;
use App\Http\Requests\ExportRequests\UserExportRequest;
use App\Http\Requests\StoreRequests\StoreUserRequest;
use App\Http\Requests\UpdateRequests\UpdateUserRequest;
use App\Http\Resources\SelectObjectResources\LaboratoriesForSelect;
use App\Http\Resources\SelectObjectResources\RolesForSelect;
use App\Http\Resources\UserResource;
use App\Models\Laboratory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

//TODO: Align User related facility variable to be plural.
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', User::class);
        $query = User::query();
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');
        if (request('email')) {
            $query->where('email', 'like', '%' . request('email') . '%');
        }
        $users = $query->orderBy($sortField, $sortDirection)->paginate(10)->withQueryString()->onEachSide(1);
        return Inertia::render('Users/Index', [
            'users' => UserResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'failure' => session('failure')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * @return Response
     */
    public function create(): Response
    {
        Gate::authorize('create', User::class);
        $roles = Role::query()->get();
        $laboratories = Laboratory::query()->get();

        $facilities = [];

        foreach ($laboratories as $laboratory){
            $facilities[$laboratory->id] = $laboratory
                                            ->facilities->map(function ($facility) {
                                                return [
                                                    'value' => $facility->id,
                                                    'label' => $facility->name
                                                ];
                                            })->toArray();
        }

        return Inertia::render('Users/Create', [
            'roles' => RolesForSelect::collection($roles),
            'laboratories' => LaboratoriesForSelect::collection($laboratories),
            'facilities' => $facilities,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * @param StoreUserRequest $request
     * @return RedirectResponse
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        Gate::authorize('store', User::class);
        $password = Str::random(10);
        $request['is_disabled'] = false;
        $request['locale'] = env('APP_LOCALE');
        $request['password'] = Hash::make($password);
        $request['name'] = $request['first_name'] . ' ' . $request['last_name'];
        $newUser = User::create($request->all())->assignRole(Role::findById($request['selectedRole'])->name);
        $newUser->email_verified_at = now();
        $newUser->save();
        event(new UserCreated($newUser, $password));
        return redirect()->route('users.index')->with('success', __('actions.user.created', ['email' => $newUser->email]));
    }

    /**
     * Display the specified resource.
     * @param User $user
     * @return Response
     */
    public function show(User $user): Response
    {
        $roles = Role::query()->get();
        $roleName = $user->roles()->select('id')->get()->toArray();
        $laboratories = Laboratory::all()->toArray();
        $facilities = $user->facilities->map(function ($facility) {
                                                return [
                                                    'value' => $facility->id,
                                                    'label' => $facility->name
                                                ];
                                            })->toArray();
        return Inertia::render('Users/Show', [
            'user' => new UserResource($user),
            'userRole' => $roleName ? $roleName[0]['id'] : '',
            'roles' => RolesForSelect::collection($roles),
            'laboratories' => $laboratories,
            'facilities' => $facilities,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     * @param User $user
     * @return Response
     */
    public function edit(User $user): Response
    {
        Gate::authorize('edit',$user);
        $roles = Role::query()->get();
        $roleName = $user->roles()->select('id')->get()->toArray();
        $laboratories = Laboratory::all()->select('id', 'name')->toArray();
        $labsForFacs = Laboratory::query()->get();
        $facilities = [];

        foreach ($labsForFacs as $labForFacs){
            $orderedFacs = $labForFacs->facilities()->orderBy('name','asc')->get();
            $facilities[$labForFacs->id] = $orderedFacs->map(function ($orderFacility){
                return [
                    'value' => $orderFacility->id,
                    'label' => $orderFacility->name,
                ];
            })->toArray();
        }

        return Inertia::render('Users/Edit', [
            'user' => new UserResource($user),
            'userRole' => $roleName ? $roleName[0]['id'] : '',
            'roles' => RolesForSelect::collection($roles),
            'laboratories' => $laboratories,
            'facilities' => $facilities,
            'failure' => session('failure'),
            'can' => [
                'changeRole' => auth()->user()->can('changeRole', $user),
                'deleteUser' => auth()->user()->can('delete', $user),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     * @param UpdateUserRequest $request
     * @param User $user
     * @return RedirectResponse
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        Gate::authorize('update', $user);
        $currentUserRole = $user->currentlyAssignedRole();
        if ($user->id != auth()->user()->id)
        {
            $user->syncRoles(Role::findById($request['role'])->name);
        }
        $roleChanged = $currentUserRole == $user->currentlyAssignedRole();
        $user->update($request->validated());
        if ($user->wasChanged() || !$roleChanged) {
            return Redirect::route('users.index')->with('success', __('actions.user.updated', ['email' => $user->email]));
        }
        return Redirect::route('users.index');
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return RedirectResponse
     */
    public function destroy(int $id): RedirectResponse
    {
        $user = User::findOrFail($id);
        Gate::authorize('delete',$user);
        $userCount = User::query()->count();
        if ($user->hasRole('super-admin')){
            Gate::authorize('delete',$user);
        }
        if ($userCount <= 1) {
            return to_route('users.edit',$user)->with('failure',__('actions.user.noUsersLeft'));
        }
        if ($id == auth()->user()->id){
            return to_route('users.edit',$user)->with('failure',__('actions.user.selfDelete'));
        }
        $email = $user->email;
        $user->delete();
        return to_route('users.index')->with('success', __('actions.user.deleted', ['email' => $email]));
    }

    public function activate(User $user): RedirectResponse
    {
        if ($user->id === auth()->user()->id) {
            return to_route('users.index')->with('failure',__('actions.user.selfDeactivate'));
        }
        Gate::authorize('activate',$user);
        $user->update([
            'is_disabled' => false
        ]);
        return to_route('users.index')->with('success', __('actions.user.activated', ['email' => $user->email]));
    }

    public function deactivate(User $user): RedirectResponse
    {
        if ($user->id === auth()->user()->id) {
            return to_route('users.index')->with('failure',__('actions.user.selfDeactivate'));
        }
        Gate::authorize('deactivate',$user);
        $user->update([
            'is_disabled' => true
        ]);
        return to_route('users.index')->with('success', __('actions.user.deactivated', ['email' => $user->email]));
    }

    /**
     * @param UserExportRequest $userExportRequest
     * @return BinaryFileResponse
     */
    public function export(UserExportRequest $userExportRequest): BinaryFileResponse
    {
        $validateData = $userExportRequest->validated();
        $dateTimeNow = Carbon::now('Europe/Vilnius')->toDateTimeString();
        return Excel::download(new UserExports($validateData), $dateTimeNow . '_users_export.xlsx');
    }
}
