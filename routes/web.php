<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ItemTypesController;
use App\Http\Controllers\InventoryItemsController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

//Route::get('/dashboard', function () {
//    return Inertia::render('Dashboard');
//})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function (){
    Route::get('/dashboard', function (){return Inertia::render('Dashboard');})->name('dashboard');
//    Route::resource('inventoryItems', InventoryItemsController::class);
//    Route::resource('itemTypes', ItemTypesController::class);
//    Route::resource('users', UserController::class);
    Route::group(['middleware' => ['role:admin']], function () {
        Route::resource('inventoryItems', InventoryItemsController::class);
        Route::resource('itemTypes', ItemTypesController::class);
        Route::resource('users', UserController::class);
//        Route::post('/inventoryItems/fetch-post-number', [InventoryItemsController::class, 'fetchPostNumber']);
        Route::post('/inventoryItems/general-identifier', [InventoryItemsController::class, 'generateUniqueIdentifier']);
        Route::get('export', [InventoryItemsController::class, 'export'])->name('export');
        Route::get('qrreader', [\App\Http\Controllers\BarcodesController::class, 'generate'])->name('qrreader');
        Route::get('/qrreader/{barcode}', [\App\Http\Controllers\BarcodesController::class, 'query'])->name('qrreader.query');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
