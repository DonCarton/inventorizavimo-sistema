<?php

namespace App\Http\Controllers;

use App\Events\UserCreated;
use App\Exports\UserExports;
use App\Http\Requests\ExportRequests\UserExportRequest;
use App\Http\Resources\SelectObjectResources\LaboratoriesForSelect;
use App\Http\Resources\SelectObjectResources\RolesForSelect;
use App\Http\Resources\UserResource;
use App\Models\Laboratory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class UserController extends Controller
{
    /**
     * @param Laboratory $laboratory
     */
    public function __construct(public Laboratory $laboratory)
    {

    }

    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(): Response
    {
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
        $roles = Role::query()->get();
        $laboratories = Laboratory::query()->get();
        return Inertia::render('Users/Create', [
            'roles' => RolesForSelect::collection($roles),
            'laboratories' => LaboratoriesForSelect::collection($laboratories)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name' => ['required','string','max:50'],
            'last_name' => ['required','string','max:50'],
            'email' => ['required','string','lowercase','email','max:60',Rule::unique('users')->whereNull('deleted_at')],
            'laboratory' => 'required',
            'selectedRole' => 'required|exists:roles,id',
        ]);
        $password = Str::random(10);
        $request['is_disabled'] = false;
        $request['locale'] = env('APP_LOCALE');
        $request['password'] = Hash::make($password);
        $request['name'] = $request['first_name'] . ' ' . $request['last_name'];
        $newUser = User::create($request->all())->assignRole(Role::findById($request['selectedRole'])->name);
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
        return Inertia::render('Users/Show', [
            'user' => new UserResource($user),
            'userRole' => $roleName ? $roleName[0]['id'] : '',
            'roles' => RolesForSelect::collection($roles),
            'laboratories' => $laboratories,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     * @param User $user
     * @return Response
     */
    public function edit(User $user): Response
    {
        $roles = Role::query()->get();
        $roleName = $user->roles()->select('id')->get()->toArray();
        $laboratories = Laboratory::all()->select('id', 'name')->toArray();
        return Inertia::render('Users/Edit', [
            'user' => new UserResource($user),
            'userRole' => $roleName ? $roleName[0]['id'] : '',
            'roles' => RolesForSelect::collection($roles),
            'laboratories' => $laboratories
        ]);
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param User $user
     * @return RedirectResponse
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => ['required','string','max:50'],
            'last_name' => ['required','string','max:50'],
            'email' => ['required','string','lowercase','email','max:60',Rule::unique('users')->ignore($user->id)->whereNull('deleted_at')],
            'laboratory' => ['required','integer','exists:laboratories,id'],
            'role' => 'required|exists:roles,id',
            'updated_by' => ['required']
        ]);
        $user->roles()->detach();
        $user->assignRole(Role::findById($data['role'])->name);
        $user->update($data);
        return Redirect::route('users.index')->with('success', __('actions.user.updated', ['email' => $user->email]));
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return RedirectResponse
     */
    public function destroy(int $id): RedirectResponse
    {
        $userCount = User::query()->count();
        if ($userCount <= 1) {
            return to_route('users.index')->with('failure', 'The record could not be deleted as there will be no users left.');
        }
        $user = User::findOrFail($id);
        $email = $user->email;
        $user->delete();
        return to_route('users.index')->with('success', __('actions.user.deleted', ['email' => $email]));
    }

    public function activate(User $user): RedirectResponse
    {
        $user->update([
            'is_disabled' => false
        ]);
        return to_route('users.index')->with('success', __('actions.user.activated', ['email' => $user->email]));
    }

    public function deactivate(User $user): RedirectResponse
    {
        $user->update([
            'is_disabled' => true
        ]);
        return to_route('users.index')->with('success', __('actions.user.deactivated', ['email' => $user->email]));
    }

    /**
     * @return BinaryFileResponse
     */
    public function export(UserExportRequest $userExportRequest): BinaryFileResponse
    {
        $validateData = $userExportRequest->validated();
        $dateTimeNow = Carbon::now('Europe/Vilnius')->toDateTimeString();
        return Excel::download(new UserExports($validateData), $dateTimeNow . '_users_export.xlsx');
    }
}
