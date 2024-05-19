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

//Route::get('/', function () {
//    return Inertia::render('Welcome', [
//        'canLogin' => Route::has('login'),
//        'canRegister' => Route::has('register'),
//        'laravelVersion' => Application::VERSION,
//        'phpVersion' => PHP_VERSION,
//    ]);
//});

Route::middleware(['auth', 'verified'])->group(function (){
    Route::get('/', function (){return Inertia::render('Dashboard');})->name('dashboard');
    Route::group(['middleware' => ['role:admin']], function () {
        Route::get('/generate-barcode', [BarcodesController::class, 'generateAndStoreBarcode'])->name('generateBarcode');
        Route::resource('inventoryItems', InventoryItemController::class)->middleware('includeUserId');
        Route::get('/inventoryItems/{inventoryItem}/editRaw', [InventoryItemController::class, 'editRaw'])->name('inventoryItems.editRaw')->middleware('includeUserId');
        Route::resource('itemTypes', ItemTypeController::class)->middleware('includeUserId');
        Route::resource('users', UserController::class)->middleware('includeUserId');
        Route::post('/inventoryItems/fetch-post-number', [InventoryItemController::class, 'fetchPostNumber']);
        Route::get('/laboratories', [LaboratoryController::class, 'index'])->name('laboratories.index');
        Route::get('/laboratories/create', [LaboratoryController::class, 'create'])->name('laboratories.create');
        Route::post('/laboratories', [LaboratoryController::class, 'store'])->middleware('includeUserId')->name('laboratories.store');
        Route::get('/laboratories/{laboratory}', [LaboratoryController::class, 'show'])->name('laboratories.show');
        Route::get('/laboratories/{laboratory}/edit', [LaboratoryController::class, 'edit'])->name('laboratories.edit');
        Route::patch('/laboratories/{laboratory}', [LaboratoryController::class, 'update'])->name('laboratories.update');
        Route::delete('/laboratories/{laboratory}', [LaboratoryController::class, 'destroy'])->name('laboratories.destroy');
        Route::get('exportUsers', [UserController::class, 'export'])->name('exportUsers');
        Route::get('exportLaboratories', [LaboratoryController::class, 'export'])->name('exportLaboratories');
        Route::post('importInventoryItems', [InventoryItemController::class, 'import'])->name('importInventoryItems');
        Route::post('importLaboratories', [LaboratoryController::class, 'import'])->name('importLaboratories');
    });
    Route::group(['middleware' => ['role:admin|user']], function (){
        Route::resource('inventoryItems', InventoryItemController::class)->only('index','show','edit');
        Route::patch('/inventoryItems/{inventoryItem}/updateAmount', [InventoryItemController::class, 'updateAmount'])->middleware('includeUserId')->name('inventoryItems.updateAmount');
        Route::patch('/inventoryItems/{inventoryItem}/takeOutAmountLog', [InventoryItemController::class, 'takeOutAmountLog'])->middleware('includeUserId')->name('inventoryItems.takeOutAmountLog');
        Route::get('reader', [BarcodesController::class, 'generate'])->name('reader');
        Route::get('/reader/{barcode}', [BarcodesController::class, 'query'])->name('reader.query');
        Route::get('/process-scan/{barcode}',[BarcodesController::class, 'getUrl'])->name('processScan');
        Route::get('exportInventoryItems', [InventoryItemController::class, 'export'])->name('exportInventoryItems');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/updateLanguage', [ProfileController::class, 'updateLanguage'])->name('profile.updateLanguage');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
