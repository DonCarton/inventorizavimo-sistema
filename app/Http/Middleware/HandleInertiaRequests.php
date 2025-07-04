<?php

namespace App\Http\Middleware;

use App\Models\Facility;
use App\Models\ImportDefinition;
use App\Models\ImportRun;
use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Laboratory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'first_name' => $request->user()->first_name,
                    'last_name' => $request->user()->last_name,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'locale' => $request->user()->locale,
                ] : null,
                'can' => $request->user() ? [
                    'create' => [
                        'user' => Auth::user()->can('create', User::class),
                        'inventoryItem' => Auth::user()->can('create', InventoryItem::class),
                        'itemType' => Auth::user()->can('create', ItemType::class),
                        'laboratory' => Auth::user()->can('create', Laboratory::class),
                        'facility' => Auth::user()->can('create',Facility::class),
                        'importDefinition' => Auth::user()->can('create', ImportDefinition::class),
                        'importRun' => Auth::user()->can('create', ImportRun::class),
                    ],
                    'view' => [
                        'user' => Auth::user()->can('viewAny', User::class),
                        'inventoryItem' => Auth::user()->can('viewAny', InventoryItem::class),
                        'itemType' => Auth::user()->can('viewAny', ItemType::class),
                        'laboratory' => Auth::user()->can('viewAny', Laboratory::class),
                        'facility' => Auth::user()->can('viewAny',Facility::class),
                        'importDefinition' => Auth::user()->can('viewAny', ImportDefinition::class),
                        'importRun' => Auth::user()->can('viewAny', ImportRun::class),
                    ]
                ] : null
            ],
            'previousUrl' => function () {
              return url()->previous();
            },
            'role' => function () use ($request) {
                $user = $request->user();
                if ($user){
                    return $user->roleName();
                } else {return null;}
            },
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'failure' => fn () => $request->session()->get('failure'),
                'warning' => fn () => $request->session()->get('warning')
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
            'language' => fn () =>
            translations(base_path('lang/' . app()->getLocale() . '.json'))
            ,
        ];
    }
}
