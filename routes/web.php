<?php

use App\Http\Controllers\DataFileImportController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\FetchDataToSelect;
use App\Http\Controllers\HistoryQueryController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\ImportRunController;
use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BarcodesController;
use App\Http\Controllers\ItemTypeController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\SystemConfigurationController;
use App\Models\ImportDefinition;
use App\Models\InventoryItem;
use App\Models\ImportRun;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function (){
    Route::get('/', function (){return Inertia::render('Dashboard');})->name('dashboard');

    Route::group(['middleware' => ['role:super-admin|admin']], function (){
        Route::get('/systemConfigurations', [SystemConfigurationController::class, 'index'])->middleware('includeUserId')->name('systemConfigurations.index');
        Route::patch('/systemConfigurations/{systemConfiguration}', [SystemConfigurationController::class, 'update'])->middleware('includeUserId')->name('systemConfigurations.update');
    });

    Route::group(['middleware' => ['role:super-admin|admin']], function() {
        Route::get('/laboratories/{laboratory}/delete-impact',[LaboratoryController::class,'deleteImpact'])->name('laboratories.delete-impact');
        Route::get('/facilities/{facility}/delete-impact',[FacilityController::class,'deleteImpact'])->name('facilities.delete-impact');
    });

    Route::group(['middleware' => ['role:super-admin|admin']], function () {

        Route::prefix('imports')->name('imports.')->group(function() {
            Route::post('importable-fields', [ImportController::class, 'getImportableFields'])->name('importableFields');
            Route::post('preview-headers', [ImportController::class, 'extractHeaders'])->name('previewHeaders');
            Route::get('{definition}/download', function (ImportDefinition $definition) {
                return Storage::download($definition->file_path);
            })->name('download');
        });
        
        Route::prefix('import-runs')->name('import-runs.')->group(function() {
                Route::get('/', [ImportRunController::class,'index'])->name('index');
                Route::get('/create', [ImportRunController::class,'create'])->name('create');
                Route::get('/{importRun}/edit', [ImportRunController::class,'edit'])->name('edit');
                Route::get('{importRun}/download', function (ImportRun $importRun) {
                    return Storage::download($importRun->file_path);
                })->name('download');
                Route::post('/{importRun}', [ImportRunController::class,'store'])->name('store');
                Route::patch('/{importRun}', [ImportRunController::class,'update'])->name('update');
                Route::patch('/requeue/{importRun}',[ImportRunController::class,'requeue'])->name('requeue');
                Route::delete('/{importRun}', [ImportRunController::class,'destroy'])->name('destroy');
        });

        Route::resource('inventoryItems', InventoryItemController::class)->middleware('includeUserId');
        Route::resource('facilities',FacilityController::class);
        Route::get('/inventoryItems/{inventoryItem}/editRaw', [InventoryItemController::class, 'editRaw'])->name('inventoryItems.editRaw')->middleware('includeUserId');
        Route::resource('itemTypes', ItemTypeController::class)->middleware('includeUserId');

        Route::resource('users', UserController::class)->middleware('includeUserId');
        Route::resource('import-definitions',DataFileImportController::class)->middleware('includeUserId');
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

        Route::prefix('adminExports')->name('adminExports.')->group(function (){
            Route::get('laboratories', [LaboratoryController::class, 'export'])->name('laboratories');
            Route::get('users', [UserController::class, 'export'])->name('users');
        });
        Route::prefix('adminImports')->name('adminImports.')->group(function (){
            Route::post('inventoryItems', [InventoryItemController::class, 'import'])->name('inventoryItems');
            Route::post('laboratories', [LaboratoryController::class, 'import'])->name('laboratories');
        });

        Route::prefix('playgrounds')->group(function () {
            Route::get('/v1/{id}', function (int $id) {
                if (strcasecmp(config('app.env'), 'Local') != 0) {abort(404);}
                $inventoryItem = InventoryItem::findOrFail($id);
                $logs = $inventoryItem->activities()->paginate(10);
                return Inertia::render('Playground', [
                   'data' => $logs,
                ]);
            })->name('firstPlayground');
        });
    });

    Route::group(['middleware' => ['role:super-admin|admin|user']], function (){

        Route::get('/download-barcode/{barcodeValue}', [BarcodesController::class, 'downloadBarcode'])->name('getBarcodePng');
        Route::resource('inventoryItems', InventoryItemController::class)->only('index','show','edit');

        Route::patch('/inventoryItems/{inventoryItem}/updateAmount', [InventoryItemController::class, 'updateAmount'])->middleware('includeUserId')->name('inventoryItems.updateAmount');
        Route::patch('/inventoryItems/{inventoryItem}/takeOutAmountLog', [InventoryItemController::class, 'takeOutAmountLog'])->middleware('includeUserId')->name('inventoryItems.takeOutAmountLog');

        Route::get('reader', [BarcodesController::class, 'generate'])->name('reader');
        Route::get('/reader/{barcode}', [BarcodesController::class, 'query'])->name('reader.query');
        Route::get('/process-scan/{barcode}',[BarcodesController::class, 'getUrl'])->name('processScan');

        Route::get('/myLaboratory', [InventoryItemController::class, 'userOwnInventory'])->name('inventoryItems.myLaboratory');

        Route::prefix('exports')->name('exports.')->group(function () {
            Route::get('/inventoryItems', [InventoryItemController::class, 'export'])->name('inventoryItems');
            Route::get('/myLaboratory', [InventoryItemController::class, 'export'])->name('myLaboratoryInventoryItems');
        });

        Route::post('/queryObjectHistory', [HistoryQueryController::class, 'getLogs'])->name('queryObjectHistory');
        Route::get('/getObjectHistory', [HistoryQueryController::class,'getObjectHistory'])->name('getObjectHistory');
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
    Route::get('/select/facilities', [FetchDataToSelect::class, 'listFacilities'])->name('select.facilities');
    Route::get('/select/cupboards', [FetchDataToSelect::class, 'listCupboards'])->name('select.cupboards');
    Route::get('/select/cupboards/{id}', [FetchDataToSelect::class, 'getCupboard'])->name('select.cupboards.specific');
    Route::get('/select/shelves', [FetchDataToSelect::class, 'listShelves'])->name('select.shelves');
    Route::get('/select/shelves/{id}', [FetchDataToSelect::class, 'getShelf'])->name('select.shelves.specific');
    Route::get('/select/ident-code',[FetchDataToSelect::class,'listIdentCode'])->name('select.identCode');
    Route::get('/select/importable-fields',[FetchDataToSelect::class,'listImportableFields'])->name('select.importableFields');
    Route::get('/select/{identCode}/facilities',[FetchDataToSelect::class,'facilitiesByIdentCode'])->name('select.facilitiesByIdentCode');
    Route::get('/select/laboratory/{laboratoryId}/facilities',[FetchDataToSelect::class,'facilitiesByLaboratory'])->name('select.facilitiesByLaboratory');
});

require __DIR__.'/auth.php';
