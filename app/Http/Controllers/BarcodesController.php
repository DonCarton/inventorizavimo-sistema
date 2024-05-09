<?php

namespace App\Http\Controllers;

use App\Models\InventoryItems;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

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
        $inventoryItem = InventoryItems::where('local_name','=',$barcode)->latest()->first();
        return Redirect::route("inventoryItems.edit", $inventoryItem);
    }
}
