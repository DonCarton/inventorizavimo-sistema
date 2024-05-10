<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
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
        $inventoryItem = InventoryItem::where('local_name','=',$barcode)->latest()->first();
        return Redirect::route("editAmount", $inventoryItem);
    }
}
