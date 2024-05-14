<?php

use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BarcodesController;
use App\Http\Controllers\ItemTypeController;
use App\Http\Controllers\InventoryItemController;
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
//        Route::delete('inventoryItems/{inventoryItem}/destroy', [InventoryItemController::class, 'destroy'])->name('inventoryItems.destroy.destroy');
        Route::get('/generate-barcode', [BarcodesController::class, 'generateAndStoreBarcode'])->name('generateBarcode');
        Route::resource('inventoryItems', InventoryItemController::class);
        Route::resource('itemTypes', ItemTypeController::class);
        Route::resource('users', UserController::class);
        Route::post('/inventoryItems/fetch-post-number', [InventoryItemController::class, 'fetchPostNumber']);
        Route::get('/laboratories', [LaboratoryController::class, 'index'])->name('laboratories.index');
        Route::get('/laboratories/create', [LaboratoryController::class, 'create'])->name('laboratories.create');
        Route::post('/laboratories', [LaboratoryController::class, 'store'])->name('laboratories.store');
        Route::get('/laboratories/{laboratory}', [LaboratoryController::class, 'show'])->name('laboratories.show');
        Route::get('/laboratories/{laboratory}/edit', [LaboratoryController::class, 'edit'])->name('laboratories.edit');
        Route::patch('/laboratories/{laboratory}', [LaboratoryController::class, 'update'])->name('laboratories.update');
        Route::delete('/laboratories/{laboratory}', [LaboratoryController::class, 'destroy'])->name('laboratories.destroy');
//        Route::post('/inventoryItems/general-identifier', [InventoryItemController::class, 'generateUniqueIdentifier']);
        Route::get('export', [InventoryItemController::class, 'export'])->name('export');
    });
//    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function (){
//        Route::resource('inventoryItems', InventoryItemController::class);
//    });
//    Route::prefix('worker')->name('worker.')->middleware('role:user')->group(function()
//    {
//        Route::get('/inventoryItems', [InventoryItemController::class, 'index'])->name('index');
//        Route::get('/laboratories', [LaboratoryController::class, 'index'])->name('index');
//    });
    Route::group(['middleware' => ['role:admin|user']], function (){
        Route::resource('inventoryItems', InventoryItemController::class)->only('index','show');
        Route::get('/inventoryItems/{inventoryItem}/editAmount', [InventoryItemController::class, 'editAmount'])->name('editAmount');
        Route::get('/inventoryItems/{inventoryItem}/takeOutAmount', [InventoryItemController::class, 'takeOutAmount'])->name('takeOutAmount');
        Route::patch('/inventoryItems/{inventoryItem}/updateAmount', [InventoryItemController::class, 'updateAmount'])->name('inventoryItems.updateAmount');
        Route::patch('/inventoryItems/{inventoryItem}/takeOutAmountLog', [InventoryItemController::class, 'takeOutAmountLog'])->name('inventoryItems.takeOutAmountLog');
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
