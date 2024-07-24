import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import React from "react";
import {__} from "@/Libs/Lang.jsx";
import SelectForSingleItem from "@/Components/Forms/SelectForSingleItem.jsx";
import NumericInput from "@/Components/Forms/NumericInput.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {RiDeleteBin6Line} from "react-icons/ri";
import LogsTable from "@/Components/Forms/LogsTable.jsx";
import AccordionWithManualIndex from "@/Components/Forms/AccordionWithManualIndex.jsx";
import TextInputExtra from "@/Components/Forms/TextInputExtra.jsx";
import Checkbox from "@/Components/Checkbox.jsx";

export default function Edit({auth, inventoryItem, logsForItem, role, laboratories, itemTypes}) {
    const handleConfirmMessage = __("Are you sure you want to delete this item") + '?';
    const {data, setData, put, errors, reset, processing} = useForm({
        local_name: inventoryItem.data.localName || '',
        name: inventoryItem.data.name || '',
        name_eng: inventoryItem.data.nameEng || '',
        inventory_type: inventoryItem.data.inventoryType || '',
        url_to_provider: inventoryItem.data.urlToProviderSite,
        alt_url_to_provider: inventoryItem.data.altUrlToProviderSite,
        total_count: inventoryItem.data.total_amount || '',
        critical_amount: inventoryItem.data.criticalAmount || '',
        to_order: inventoryItem.data.toOrder || '',
        average_consumption: inventoryItem.data.averageConsumption || '',
        provider: inventoryItem.data.provider || '',
        barcode: inventoryItem.data.barcode || '',
        product_code: inventoryItem.data.productCode || '',
        laboratory: inventoryItem.data.laboratory || '',
        cupboard: inventoryItem.data.cupboard || '',
        shelf: inventoryItem.data.shelf || '',
        multiple_locations: inventoryItem.data.multipleLocations || '',
    })
    const inventoryTypeDetails = inventoryItem.data.inventoryType;
    const handleDestroy = (value) => {
        if (window.confirm(handleConfirmMessage)) {
            router.delete(route('inventoryItems.destroy', value), {
                preserveScroll: true
            })
        }
    }
    const onSubmit = (e) => {
        e.preventDefault();
        put(route('inventoryItems.update', inventoryItem.data.id));
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Edit")} - {inventoryItem.data.name}</h2>
                </div>
            }
            role={role}
        >
            <Head title={__("Edit") + ' - ' + inventoryItem.data.name}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="pb-6">
                                <AccordionWithManualIndex expandedByDefault={true} indexOfAcc={3} headerName={__("Inventory information")}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_local_name">{__("Local name")}</InputLabel>
                                            <TextInput id="inventoryItems_local_name" type="text" name="local_name"
                                                       value={data.local_name} disabled={true} readOnly={true}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_inventory_type">{__("Type")}</InputLabel>
                                            <SelectForSingleItem
                                                className="disabled:text-white disabled:bg-gray-500" disabled={true}
                                                id="inventoryItems_inventory_type" name="inventory_type"
                                                value={data.inventory_type} options={itemTypes.data}
                                                noValueText={__("Choose a value")}/>
                                        </div>
                                        {inventoryItem.data.assetNumber !== null ? <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_asset_number"
                                                        value={__("Asset number")}/>
                                            <TextInput id="inventoryItems_asset_number" type="text" disabled={true}
                                                       readOnly={true} name="asset_number"
                                                       value={inventoryItem.data.assetNumber}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div> : null}
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_name">{__("Name")}<span
                                                className="text-red-500">*</span></InputLabel>
                                            <TextInput id="inventoryItems_name" type="text" name="name"
                                                       value={data.name} className="mt-1 block w-full"
                                                       onChange={e => setData('name', e.target.value)}/>
                                            <InputError message={errors.name} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_name_eng">{__("Name ENG")}<span
                                                className="text-red-500">*</span></InputLabel>
                                            <TextInput id="inventoryItems_name_eng" type="text" name="name_eng"
                                                       value={data.name_eng} className="mt-1 block w-full"
                                                       onChange={e => setData('name_eng', e.target.value)}/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <AccordionWithManualIndex expandedByDefault={true} indexOfAcc={1} headerName={__("Amount")}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_total_amount" value={__("Amount")}/>
                                            <NumericInput id="inventoryItems_total_amount" type="text"
                                                          name="total_amount" value={data.total_count}
                                                          className="mt-1 block w-full"
                                                          onChange={e => setData('total_count', e.target.value)}/>
                                        </div>
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_critical_amount"
                                                        value={__("Critical amount")}/>
                                            <TextInput id="inventoryItems_critical_amount" type="text"
                                                       name="critical_amount" value={data.critical_amount}
                                                       className="mt-1 block w-full"
                                                       onChange={e => setData('critical_amount', e.target.value)}/>
                                            <InputError message={errors.critical_amount} className="mt-2"/>
                                        </div>
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_to_order"
                                                        value={__("To order")}/>
                                            <NumericInput id="inventoryItems_to_order" type="text"
                                                       name="to_order" value={data.to_order}
                                                       className="mt-1 block w-full"
                                                       onChange={e => setData('to_order', e.target.value)}/>
                                            <InputError message={errors.to_order} className="mt-2"/>
                                        </div>
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_average_consumption"
                                                        value={__("Average consumption")}/>
                                            <NumericInput id="inventoryItems_average_consumption" type="text"
                                                       name="average_consumption" value={data.average_consumption}
                                                       className="mt-1 block w-full"
                                                       onChange={e => setData('average_consumption', e.target.value)}/>
                                            <InputError message={errors.average_consumption} className="mt-2"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <AccordionWithManualIndex expandedByDefault={false} indexOfAcc={4} headerName={__("Order information")}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_product_code"
                                                        value={__("Product code")}/>
                                            <TextInput id="inventoryItems_product_code" type="text" name="product_code"
                                                       value={data.product_code}
                                                       onChange={e => setData('product_code', e.target.value)}
                                                       className="mt-1 block w-full"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_barcode"
                                                        value={__("Barcode")}/>
                                            <TextInput id="inventoryItems_barcode" type="text" name="barcode"
                                                       value={data.barcode}
                                                       onChange={e => setData('barcode', e.target.value)}
                                                       className="mt-1 block w-full"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_provider" value={__("Provider")}/>
                                            <TextInput id="inventoryItems_provider" type="text" name="provider"
                                                       value={data.provider}
                                                       onChange={e => setData('provider', e.target.value)}
                                                       className="mt-1 block w-full"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_provider_url"
                                                        value={__("Provider url")}/>
                                            <TextInput id="inventoryItems_provider_url" type="text"
                                                       name="provider_url"
                                                       value={data.url_to_provider}
                                                       onChange={e => setData('url_to_provider', e.target.value)}
                                                       className="mt-1 block w-full"/>
                                            <InputError message={errors.url_to_provider} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_alt_url_to_provider"
                                                        value={__("Alt url to provider")}/>
                                            <TextInput id="inventoryItems_alt_url_to_provider" type="text"
                                                       name="alt_url_to_provider"
                                                       value={inventoryItem.data.altUrlToProviderSite}
                                                       onChange={e => setData('alt_url_to_provider', e.target.value)}
                                                       className="mt-1 block w-full"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <AccordionWithManualIndex expandedByDefault={false} indexOfAcc={2} headerName={__("Location")}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_local_laboratory"
                                                        value={__("Laboratory")}/>
                                            <SelectForSingleItem id="inventoryItems_local_laboratory"
                                                                 name="laboratory" value={data.laboratory}
                                                                 onChange={e => setData('laboratory', e.target.value)}
                                                                 options={laboratories.data}
                                                                 noValueText={__("Choose a value")}/>
                                            <InputError message={errors.laboratory} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_cupboard" value={__("Cupboard")}/>
                                            <TextInput id="inventoryItems_cupboard" type="text" name="cupboard"
                                                       value={data.cupboard} className="mt-1 block w-full"
                                                       onChange={e => setData('cupboard', e.target.value)}/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_shelf" value={__("Shelf")}/>
                                            <TextInput id="inventoryItems_shelf" type="text" name="shelf"
                                                       value={data.shelf} className="mt-1 block w-full"
                                                       onChange={e => setData('shelf', e.target.value)}/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_multiple_locations"
                                                        value={__("Multiple locations")}/>
                                            <Checkbox checked={data.multiple_locations} onChange={e => setData('multiple_locations', e.target.checked)}
                                                      className="mt-1 block w-6 h-6"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <AccordionWithManualIndex expandedByDefault={false} indexOfAcc={5} headerName={__("Additional information")}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_storage_conditions"
                                                        value={__("Storage conditions")}/>
                                            <TextInputExtra id="inventoryItems_storage_conditions"
                                                            name="storage_conditions" type="textarea"
                                                            className="mt-1 block w-full"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_used_for"
                                                        value={__("Used for")}/>
                                            <TextInputExtra id="inventoryItems_used_for" name="used_for"
                                                            type="textarea"
                                                            className="mt-1 block w-full"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_comments"
                                                        value={__("Comments")}/>
                                            <TextInputExtra id="inventoryItems_comments" name="comments"
                                                            type="textarea"
                                                            className="mt-1 block w-full"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                {/*<Accordion open={open === 1} icon={<Icon id={1} open={open}/>}>*/}
                                {/*    <AccordionHeader onClick={() => handleOpen(1)}>{__("Amount")}</AccordionHeader>*/}
                                {/*    <AccordionBody>*/}
                                {/*    </AccordionBody>*/}
                                {/*</Accordion>*/}
                                {/*<Accordion open={open2 === 2} icon={<Icon id={2} open={open2}/>}>*/}
                                {/*    <AccordionHeader onClick={() => handleOpen2(2)}>{__("Location")}</AccordionHeader>*/}
                                {/*    <AccordionBody>*/}
                                {/*    </AccordionBody>*/}
                                {/*</Accordion>*/}
                                {/*<Accordion open={open3 === 3} icon={<Icon id={3} open={open3}/>}>*/}
                                {/*    <AccordionHeader*/}
                                {/*        onClick={() => handleOpen3(3)}>{__("Inventory information")}</AccordionHeader>*/}
                                {/*    <AccordionBody>*/}
                                {/*    </AccordionBody>*/}
                                {/*</Accordion>*/}
                                {/*<Accordion open={open4 === 4} icon={<Icon id={4} open={open4}/>}>*/}
                                {/*    <AccordionHeader*/}
                                {/*        onClick={() => handleOpen4(4)}>{__("Order information")}</AccordionHeader>*/}
                                {/*    <AccordionBody>*/}
                                {/*    </AccordionBody>*/}
                                {/*</Accordion>*/}
                                <div className="flex justify-between mt-4">
                                    <div>
                                        <Link href={route('inventoryItems.index')}
                                              className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                        >
                                            {__("Cancel")}
                                        </Link>
                                        <PrimaryButton className="ml-2"
                                                       disabled={processing}>{__("Save")}</PrimaryButton>
                                    </div>
                                    <a type="button" onClick={() => handleDestroy(inventoryItem.data.id)}
                                       className="inline-flex items-center px-4 py-2 bg-pink-500 dark:bg-pink-500 border border-pink-500 hover:border-pink-800 dark:border-pink-500 rounded-md font-semibold text-xs text-white dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-rose-800 dark:hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150">{__("Delete")}
                                        <RiDeleteBin6Line className="ml-1 w-5 h-5 text-white"/>
                                    </a>
                                </div>
                            </div>
                        </form>
                        {logsForItem.data.length > 0 && <LogsTable logsForItem={logsForItem}/>}
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
