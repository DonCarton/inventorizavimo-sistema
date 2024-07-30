<?php

use App\Http\Controllers\FetchDataToSelect;
use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BarcodesController;
use App\Http\Controllers\ItemTypeController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\UserController;
use App\Models\InventoryItem;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function (){
    Route::get('/', function (){return Inertia::render('Dashboard');})->name('dashboard');
    Route::group(['middleware' => ['role:admin']], function () {
        Route::resource('inventoryItems', InventoryItemController::class)->middleware('includeUserId');
        Route::get('/inventoryItems/{inventoryItem}/editRaw', [InventoryItemController::class, 'editRaw'])->name('inventoryItems.editRaw')->middleware('includeUserId');
        Route::resource('itemTypes', ItemTypeController::class)->middleware('includeUserId');
        Route::resource('users', UserController::class)->middleware('includeUserId');
        Route::patch('/users/{user}/activate', [UserController::class, 'activate'])->name('users.activate')->middleware('includeUserId');
        Route::patch('/users/{user}/deactivate', [UserController::class, 'deactivate'])->name('users.deactivate')->middleware('includeUserId');
        Route::post('/inventoryItems/fetch-post-number', [InventoryItemController::class, 'fetchPostNumber']);
        Route::get('/laboratories', [LaboratoryController::class, 'index'])->name('laboratories.index');
        Route::get('/laboratories/create', [LaboratoryController::class, 'create'])->name('laboratories.create');
        Route::post('/laboratories', [LaboratoryController::class, 'store'])->middleware('includeUserId')->name('laboratories.store');
        Route::get('/laboratories/{laboratory}', [LaboratoryController::class, 'show'])->name('laboratories.show');
        Route::get('/laboratories/{laboratory}/edit', [LaboratoryController::class, 'edit'])->name('laboratories.edit');
        Route::patch('/laboratories/{laboratory}', [LaboratoryController::class, 'update'])->middleware('includeUserId')->name('laboratories.update');
        Route::delete('/laboratories/{laboratory}', [LaboratoryController::class, 'destroy'])->name('laboratories.destroy');
        Route::get('exportUsers', [UserController::class, 'export'])->name('exportUsers');
        Route::get('exportLaboratories', [LaboratoryController::class, 'export'])->name('exportLaboratories');
        Route::post('importInventoryItems', [InventoryItemController::class, 'import'])->name('importInventoryItems');
        Route::post('importLaboratories', [LaboratoryController::class, 'import'])->name('importLaboratories');
        Route::post('/queryObjectHistory', [InventoryItemController::class, 'queryObjectHistory'])->name('inventoryItems.queryObjectHistory');
        Route::get('/playground/{id}', function (int $id){
            $inventoryItem = InventoryItem::findOrFail($id);
            return Inertia::render('Playground', [
                'inventoryItem' => $inventoryItem,
            ]);
        })->name('inventoryItems.playground');
    });
    Route::group(['middleware' => ['role:admin|user']], function (){
        Route::get('/download-barcode/{barcodeValue}', [BarcodesController::class, 'downloadBarcode'])->name('getBarcodePng');
        Route::resource('inventoryItems', InventoryItemController::class)->only('index','show','edit');
        Route::patch('/inventoryItems/{inventoryItem}/updateAmount', [InventoryItemController::class, 'updateAmount'])->middleware('includeUserId')->name('inventoryItems.updateAmount');
        Route::patch('/inventoryItems/{inventoryItem}/takeOutAmountLog', [InventoryItemController::class, 'takeOutAmountLog'])->middleware('includeUserId')->name('inventoryItems.takeOutAmountLog');
        Route::get('reader', [BarcodesController::class, 'generate'])->name('reader');
        Route::get('/reader/{barcode}', [BarcodesController::class, 'query'])->name('reader.query');
        Route::get('/process-scan/{barcode}',[BarcodesController::class, 'getUrl'])->name('processScan');
        Route::get('exportInventoryItems', [InventoryItemController::class, 'export'])->name('exportInventoryItems');
        Route::get('/myLaboratory', [InventoryItemController::class, 'userOwnInventory'])->name('inventoryItems.myLaboratory');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/updateLanguage', [ProfileController::class, 'updateLanguage'])->name('profile.updateLanguage');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/select/itemTypes', [FetchDataToSelect::class, 'listItemTypes'])->name('select.itemTypes');
    Route::get('/select/laboratories', [FetchDataToSelect::class, 'listLaboratories'])->name('select.laboratories');
});

require __DIR__.'/auth.php';
