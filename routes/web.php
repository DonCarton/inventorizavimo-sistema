<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BarcodesController;
use App\Http\Controllers\ItemTypeController;
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
    Route::group(['middleware' => ['role:admin']], function () {
        Route::resource('inventoryItems', InventoryItemsController::class);
        Route::resource('itemTypes', ItemTypeController::class);
        Route::resource('users', UserController::class);
//        Route::post('/inventoryItems/fetch-post-number', [InventoryItemsController::class, 'fetchPostNumber']);
        Route::post('/inventoryItems/general-identifier', [InventoryItemsController::class, 'generateUniqueIdentifier']);
        Route::get('/inventoryItems/{inventoryItem}/editAmount', [InventoryItemsController::class, 'editAmount'])->name('editAmount');
        Route::patch('inventoryItems/{inventoryItem}/updateAmount', [InventoryItemsController::class, 'updateAmount'])->name('inventoryItems.updateAmount');
        Route::get('export', [InventoryItemsController::class, 'export'])->name('export');
        Route::get('reader', [BarcodesController::class, 'generate'])->name('reader');
        Route::get('/reader/{barcode}', [BarcodesController::class, 'query'])->name('reader.query');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/updateLanguage', [ProfileController::class, 'updateLanguage'])->name('profile.updateLanguage');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
