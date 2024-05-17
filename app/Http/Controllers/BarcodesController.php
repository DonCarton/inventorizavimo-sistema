<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Milon\Barcode\DNS1D;
use Milon\Barcode\DNS2D;

class BarcodesController extends Controller
{
    public function index(){
        //
    }
    public function generate(): \Inertia\Response
    {
        return Inertia::render('Scanner/Reader');
    }
    public function query(string $barcode): RedirectResponse
    {
        $inventoryItem = InventoryItem::where('local_name','=',$barcode)->latest()->first();
        return Redirect::route("editAmount", $inventoryItem);
    }
    public function generateAndStoreBarcode(): string
    {
        $barcodeData = 'BEN011-P';
        $barcode = (new \Milon\Barcode\DNS1D)->getBarcodePNG($barcodeData, 'C39');
        $filename = 'barcode_' . $barcodeData . '.png';
        Storage::disk('public')->put($filename, base64_decode((new \Milon\Barcode\DNS1D)->getBarcodePNG($barcodeData,"C39",1,99,array(1,1,1), true)));
        return 'Barcode generated and store in the public folder';
    }
}
