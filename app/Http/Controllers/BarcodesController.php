<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use Illuminate\Support\Facades\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Response as FacadeResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Milon\Barcode\DNS1D;
use Milon\Barcode\DNS2D;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BarcodesController extends Controller
{
    public function generate(): \Inertia\Response
    {
        return Inertia::render('Scanner/Reader2',[
            'failure' => session('failure')
        ]);
    }
    public function query(string $barcode): RedirectResponse
    {
        $inventoryItem = InventoryItem::where('local_name','=', $barcode)->firstOrFail();
        return Redirect::route("inventoryItems.edit", $inventoryItem);
    }
    public function getUrl(string $barcode): RedirectResponse
    {
        $inventoryItem = InventoryItem::where('local_name','=', $barcode)->latest()->first();
        if ($inventoryItem == null){
            return redirect()->route('reader')->with('failure',__('actions.noItemFound', ['name' => $barcode]) . '.');
        }
        return Redirect::route("inventoryItems.edit", $inventoryItem);
    }
    public function downloadBarcode(string $barcode): StreamedResponse
    {
        return $this->generateAndDownloadBarcode($barcode);
    }
    public function generateAndDownloadBarcode(string $barcodeData): StreamedResponse
    {
        $barcode = (new \Milon\Barcode\DNS1D)->getBarcodePNG($barcodeData,"C128",1,99,array(1,1,1), true);
        $barcodeContent = base64_decode($barcode);

        $filename = 'barcode_' . $barcodeData . '.png';

        $stream = function() use ($barcodeContent) {
            echo $barcodeContent;
        };

        return FacadeResponse::stream($stream, 200, [
            'Content-Type' => 'image/png',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
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
