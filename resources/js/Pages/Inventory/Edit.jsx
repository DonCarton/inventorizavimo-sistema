import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import React from "react";
import StringHelper from "@/Libs/StringHelper.jsx";
import SelectForSingleItem from "@/Components/Forms/SelectForSingleItem.jsx";
import NumericInput from "@/Components/Forms/NumericInput.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import LogsTable from "@/Components/Forms/LogsTable.jsx";
import AccordionWithManualIndex from "@/Components/Forms/AccordionWithManualIndex.jsx";
import TextInputExtra from "@/Components/Forms/TextInputExtra.jsx";
import Checkbox from "@/Components/Checkbox.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import DeleteButton from "@/Components/Forms/DeleteButton.jsx";
import { useState, useEffect, useRef } from 'react';
import FlexibleStaticSelect from '@/Components/Forms/FlexibleStaticSelect';

export default function Edit({auth, inventoryItem, logsForItem, laboratories, facilities, itemTypes, queryParams, referrer, cupboardOptions, shelfOptions, can}) {
    const isFirstLoad = useRef(true);
    const handleConfirmMessage = StringHelper.__("Are you sure you want to delete this item") + '?';
    const [facilityOptions, setFacilityOptions] = useState(facilities.data || []);
    const {data, setData, put, delete: destroy, errors, processing} = useForm({
        local_name: inventoryItem.data.localName || '',
        inventory_type: inventoryItem.data.inventoryType || '',
        name: inventoryItem.data.name || '',
        name_eng: inventoryItem.data.nameEng || '',
        formula: inventoryItem.data.formula || '',
        cas_nr: inventoryItem.data.casNr || '',
        user_guide: inventoryItem.data.userGuide || '',
        provider: inventoryItem.data.provider || '',
        product_code: inventoryItem.data.productCode || '',
        barcode: inventoryItem.data.barcode || '',
        url_to_provider: inventoryItem.data.urlToProviderSite || '',
        alt_url_to_provider: inventoryItem.data.altUrlToProviderSite || '',
        total_amount: inventoryItem.data.totalAmount || 0,
        critical_amount: inventoryItem.data.criticalAmount || 0,
        to_order_amount: inventoryItem.data.toOrderAmount || '',
        average_consumption: inventoryItem.data.averageConsumption || '',
        multiple_locations: inventoryItem.data.multipleLocations || 0,
        laboratory: inventoryItem.data.laboratory || '',
        facilities: inventoryItem.data.facilities || [],
        cupboard: inventoryItem.data.cupboard || 1,
        shelf: inventoryItem.data.shelf || 'A',
        storage_conditions: inventoryItem.data.storageConditions || '',
        asset_number: inventoryItem.data.assetNumber || '',
        used_for: inventoryItem.data.usedFor || '',
        comments: inventoryItem.data.comments || ''
    })
    useEffect(() => {
        if (!data.laboratory) {
            setFacilityOptions([]);
            setData('facility', []);
            return;
        }
        axios.get(`/select/laboratory/${data.laboratory}/facilities`)
        .then((response) => {
            setFacilityOptions(response.data.facilities);
            if (isFirstLoad.current){
                isFirstLoad.current = false;
            } else {
                setData('facility', []);
            }
        });
    },[data.laboratory]);

    const handleDestroy = (value) => {
        if (window.confirm(handleConfirmMessage)) {
            destroy(route('inventoryItems.destroy', value));
        }
    }
    const onSubmit = (e) => {
        e.preventDefault();
        put(route('inventoryItems.update', {inventoryItem: inventoryItem.data.id, query: queryParams, referrer: referrer}));
    }
    const handleInventoryTypeChange = (e) => {
        if (!can.alterType) { return; }
        setData('inventory_type',e.target.value);
    }
    const handleCupboardChange = (e) => {
        if (e.target.value === undefined){
            return;
        }
        const cleanInt = parseInt(e.target.value);
        setData('cupboard',cleanInt);
    }
    const handleShelfChange = (e) => {
        setData('shelf',e.target.value);
    }
    const handleFacilityChange = (e) => {
        setData('facilities', e);
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Edit")} - {inventoryItem.data.name}</h2>
                </div>
            }
        >
            <Head title={StringHelper.__("Edit") + ' - ' + inventoryItem.data.name}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="pb-6">
                                <AccordionWithManualIndex expandedByDefault={true} indexOfAcc={3} headerName={StringHelper.__("Inventory information")}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_local_name">{StringHelper.__("Local name")}</InputLabel>
                                            <TextInput id="inventoryItems_local_name" type="text" name="local_name"
                                                       value={data.local_name}
                                                       disabled={!can.alterLocalName}
                                                       readOnly={!can.alterLocalName}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            <InputError message={errors.local_name} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_inventory_type">{StringHelper.__("Type")}</InputLabel>
                                            <SelectForSingleItem
                                                className="disabled:text-white disabled:bg-gray-400" disabled={!can.alterType}
                                                id="inventoryItems_inventory_type" name="inventory_type" onChange={handleInventoryTypeChange}//onChange={e => setData('inventory_type', e.target.value)}
                                                value={data.inventory_type} options={itemTypes.data}
                                                noValueText={StringHelper.__("Choose a value")}/>
                                            <InputError message={errors.inventory_type} className="mt-2"/>
                                        </div>
                                        {inventoryItem.data.assetNumber !== null ? <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_asset_number"
                                                        value={StringHelper.__("Asset number")}/>
                                            <TextInput id="inventoryItems_asset_number" type="text" disabled={true}
                                                       readOnly={true} name="asset_number"
                                                       value={inventoryItem.data.assetNumber}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            <InputError message={errors.assetNumber} className="mt-2"/>
                                        </div> : null}
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_name">{StringHelper.__("Name")}<span
                                                className="text-red-500">*</span></InputLabel>
                                            <TextInput id="inventoryItems_name" type="text" name="name"
                                                       value={data.name} className="mt-1 block w-full"
                                                       onChange={e => setData('name', e.target.value)}/>
                                            <InputError message={errors.name} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_name_eng">{StringHelper.__("Name ENG")}<span
                                                className="text-red-500">*</span></InputLabel>
                                            <TextInput id="inventoryItems_name_eng" type="text" name="name_eng"
                                                       value={data.name_eng} className="mt-1 block w-full"
                                                       onChange={e => setData('name_eng', e.target.value)}/>
                                            <InputError message={errors.name_eng} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_formula">{StringHelper.__("Formula")}</InputLabel>
                                            <TextInput id="inventoryItems_formula" type="text" name="formula"
                                                       value={data.formula} className="mt-1 block w-full"
                                                       onChange={e => setData('formula', e.target.value)}/>
                                            <InputError message={errors.formula} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_cas_nr">{StringHelper.__("CAS NR")}</InputLabel>
                                            <TextInput id="inventoryItems_cas_nr" type="text" name="cas_nr"
                                                       value={data.cas_nr} className="mt-1 block w-full"
                                                       onChange={e => setData('cas_nr', e.target.value)}/>
                                            <InputError message={errors.cas_nr} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_user_guide">{StringHelper.__("User guide")}</InputLabel>
                                            <TextInput id="inventoryItems_user_guide" type="text" name="user_guide"
                                                       value={data.user_guide} className="mt-1 block w-full"
                                                       onChange={e => setData('user_guide', e.target.value)}/>
                                            <InputError message={errors.user_guide} className="mt-2"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <AccordionWithManualIndex expandedByDefault={true} indexOfAcc={1}
                                                          headerName={StringHelper.__("Amount")}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_total_amount" value={StringHelper.__("Amount")}/>
                                            <NumericInput id="inventoryItems_total_amount" type="text"
                                                          name="total_amount" value={data.total_amount}
                                                          className="mt-1 block w-full"
                                                          onChange={e => setData('total_amount', e.target.value)}/>
                                            <InputError message={errors.total_amount} className="mt-2"/>
                                        </div>
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_critical_amount"
                                                        value={StringHelper.__("Critical amount")}/>
                                            <TextInput id="inventoryItems_critical_amount" type="text"
                                                       name="critical_amount" value={data.critical_amount}
                                                       className="mt-1 block w-full"
                                                       onChange={e => setData('critical_amount', e.target.value)}/>
                                            <InputError message={errors.critical_amount} className="mt-2"/>
                                        </div>
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_to_order_amount"
                                                        value={StringHelper.__("To order")}/>
                                            <NumericInput id="inventoryItems_to_order_amount" type="text"
                                                       name="to_order_amount" value={data.to_order_amount}
                                                       className="mt-1 block w-full"
                                                       onChange={e => setData('to_order_amount', e.target.value)}/>
                                            <InputError message={errors.to_order_amount} className="mt-2"/>
                                        </div>
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_average_consumption"
                                                        value={StringHelper.__("Average consumption")}/>
                                            <NumericInput id="inventoryItems_average_consumption" type="text"
                                                       name="average_consumption" value={data.average_consumption}
                                                       className="mt-1 block w-full"
                                                       onChange={e => setData('average_consumption', e.target.value)}/>
                                            <InputError message={errors.average_consumption} className="mt-2"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <AccordionWithManualIndex expandedByDefault={false} indexOfAcc={4} headerName={StringHelper.__("Order information")}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_product_code"
                                                        value={StringHelper.__("Product code")}/>
                                            <TextInput id="inventoryItems_product_code" type="text" name="product_code"
                                                       value={data.product_code}
                                                       onChange={e => setData('product_code', e.target.value)}
                                                       className="mt-1 block w-full"/>
                                            <InputError message={errors.product_code} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_barcode"
                                                        value={StringHelper.__("Barcode")}/>
                                            <TextInput id="inventoryItems_barcode" type="text" name="barcode"
                                                       value={data.barcode}
                                                       onChange={e => setData('barcode', e.target.value)}
                                                       className="mt-1 block w-full"/>
                                            <InputError message={errors.barcode} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_provider" value={StringHelper.__("Provider")}/>
                                            <TextInput id="inventoryItems_provider" type="text" name="provider"
                                                       value={data.provider}
                                                       onChange={e => setData('provider', e.target.value)}
                                                       className="mt-1 block w-full"/>
                                            <InputError message={errors.provider} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_provider_url"
                                                        value={StringHelper.__("Provider url")}/>
                                            <TextInput id="inventoryItems_provider_url" type="text"
                                                       name="provider_url"
                                                       value={data.url_to_provider}
                                                       onChange={e => setData('url_to_provider', e.target.value)}
                                                       className="mt-1 block w-full"/>
                                            <InputError message={errors.url_to_provider} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_alt_url_to_provider"
                                                        value={StringHelper.__("Alt url to provider")}/>
                                            <TextInput id="inventoryItems_alt_url_to_provider" type="text"
                                                       name="alt_url_to_provider"
                                                       value={data.alt_url_to_provider}
                                                       onChange={e => setData('alt_url_to_provider', e.target.value)}
                                                       className="mt-1 block w-full"/>
                                            <InputError message={errors.altUrlToProviderSite} className="mt-2"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <AccordionWithManualIndex expandedByDefault={false} indexOfAcc={2} headerName={StringHelper.__("Location")}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_local_laboratory"
                                                        value={StringHelper.__("Laboratory")}/>
                                            <SelectForSingleItem id="inventoryItems_local_laboratory"
                                                                 name="laboratory" value={data.laboratory}
                                                                 onChange={e => setData('laboratory', e.target.value)}
                                                                 disabled={!can.alterLocation}
                                                                 options={laboratories.data}
                                                                 noValueText={StringHelper.__("Choose a value")}/>
                                            <InputError message={errors.laboratory} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_local_facility">
                                                {StringHelper.__("Facility")}
                                                <span className="text-red-500">*</span>
                                            </InputLabel>
                                            <div className="mt-1">
                                                <FlexibleStaticSelect id="inventoryItems_local_facility" name="facility" options={facilityOptions} customPlaceHolder={StringHelper.__("Choose a facility")}
                                                    value={data.facilities} onChange={handleFacilityChange} customNoOptionsMessage={StringHelper.__("No facilities found")} customIsMulti={true}/>
                                            </div>
                                            <InputError message={errors.facilities} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_cupboard" value={StringHelper.__("Cupboard")} className="mb-1"/>
                                            <select
                                                    id="inventoryItems_cupboard"
                                                    name="local_cupboard"
                                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                                                    value={data.cupboard}
                                                    onChange={handleCupboardChange}>
                                                    {cupboardOptions.map((cupboardOption) => (
                                                        <option key={cupboardOption.id} value={cupboardOption.id}>{cupboardOption.label}</option>
                                                    ))}
                                            </select>
                                            <InputError message={errors.cupboard} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_shelf" value={StringHelper.__("Shelf")} className="mb-1"/>
                                            <select
                                                    id="inventoryItems_shelf"
                                                    name="local_shelf"
                                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                                                    value={data.shelf}
                                                    onChange={handleShelfChange}>
                                                    {shelfOptions.map((shelfOption) => (
                                                        <option key={shelfOption.id} value={shelfOption.id}>{shelfOption.label}</option>
                                                    ))}
                                            </select>
                                            <InputError message={errors.shelf} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_multiple_locations"
                                                        value={StringHelper.__("Multiple locations")}/>
                                            <Checkbox checked={data.multiple_locations} onChange={e => setData('multiple_locations', e.target.checked)}
                                                      className="mt-1 block w-6 h-6"/>
                                            <InputError message={errors.multiple_locations} className="mt-2"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <AccordionWithManualIndex expandedByDefault={false} indexOfAcc={5} headerName={StringHelper.__("Additional information")}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_storage_conditions"
                                                        value={StringHelper.__("Storage conditions")}/>
                                            <TextInputExtra id="inventoryItems_storage_conditions"
                                                            name="storage_conditions" type="textarea" value={data.storage_conditions} onChange={e => setData('storage_conditions', e.target.value)}
                                                            className="mt-1 block w-full"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_used_for"
                                                        value={StringHelper.__("Used for")}/>
                                            <TextInputExtra id="inventoryItems_used_for" name="used_for"
                                                            type="textarea" value={data.used_for} onChange={e => setData('used_for', e.target.value)}
                                                            className="mt-1 block w-full"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_comments"
                                                        value={StringHelper.__("Comments")}/>
                                            <TextInputExtra id="inventoryItems_comments" name="comments"
                                                            type="textarea" value={data.comments} onChange={e => setData('comments', e.target.value)}
                                                            className="mt-1 block w-full"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <div className="flex justify-between mt-4">
                                    <div>
                                        <Link href={route(`inventoryItems.${referrer ? referrer : 'index'}`, queryParams)}><SecondaryButton type="button" disabled={processing}>{StringHelper.__("Cancel")}</SecondaryButton></Link>
                                        <PrimaryButton className="ml-2"
                                                       disabled={processing}>{StringHelper.__("Save")}</PrimaryButton>
                                    </div>
                                    {can.delete && <DeleteButton type="button" disabled={processing} onClick={() => handleDestroy(inventoryItem.data.id)}>{StringHelper.__("Delete")}</DeleteButton>}
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
