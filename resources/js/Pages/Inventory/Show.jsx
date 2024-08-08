import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import StringHelper from '@/Libs/StringHelper';
import {FaDownload} from 'react-icons/fa';
import SelectForSingleItem from "@/Components/Forms/SelectForSingleItem.jsx";
import Checkbox from "@/Components/Checkbox.jsx";
import TextInputExtra from "@/Components/Forms/TextInputExtra.jsx";
import AccordionWithManualIndex from "@/Components/Forms/AccordionWithManualIndex.jsx";
import React, {useState} from "react";
import ClickableUrlInput from "@/Components/Forms/ClickableUrlInput.jsx";
import HistoryLog from "@/Components/Forms/HistoryLog.jsx";
import ActionButton from '@/Components/Forms/ActionButton';


export default function Show({auth, inventoryItem, role, laboratories, itemTypes}) {
    const [openAll, setOpenAll] = useState(true);
    const toggleAllAccordions = () => {
        setOpenAll(!openAll);
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Show")} - {inventoryItem.data.name}</h2>
                    <div className="flex space-x-2 h-12">
                        <HistoryLog
                            objectId={inventoryItem.data.id}
                            objectType="inventory_item"
                            nameOfButton={StringHelper.__("History")}
                            nameOfCloseButton={StringHelper.__("Close")}
                        ></HistoryLog>
                        <ActionButton onClick={toggleAllAccordions} title={StringHelper.__("Toggle if the form should be fully expanded or collapsed") + '.'} className="text-lg">{openAll ? StringHelper.__("Collapse form") : StringHelper.__("Expand form")}</ActionButton>
                    </div>
                </div>
            }
            role={role}
        >
            <Head title={StringHelper.__("Show") + ' - ' + inventoryItem.data.name}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="pb-6">
                                <AccordionWithManualIndex expandedByDefault={openAll} indexOfAcc={1}
                                                          headerName={StringHelper.__("Inventory information")}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_local_name">{StringHelper.__("Local name")}</InputLabel>
                                            <TextInput
                                                id="inventoryItems_local_name"
                                                type="text" disabled={true} readOnly={true} name="local_name"
                                                value={inventoryItem.data.localName}
                                                className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_inventory_type">{StringHelper.__("Type")}</InputLabel>
                                            <SelectForSingleItem value={inventoryItem.data.inventoryType}
                                                                 className="disabled:text-white disabled:bg-gray-500"
                                                                 options={itemTypes.data} disabled={true}
                                                                 name="inventory_type"
                                                                 id="inventoryItems_inventory_type"
                                                                 noValueText={StringHelper.__("Choose a value")}/>
                                        </div>
                                        {inventoryItem.data.assetNumber !== null ? <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_asset_number"
                                                        value={StringHelper.__("Asset number")}/>
                                            <TextInput id="inventoryItems_asset_number" type="text" disabled={true}
                                                       readOnly={true} name="asset_number"
                                                       value={inventoryItem.data.assetNumber}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div> : <></>}
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_name" value={StringHelper.__("Name")}/>
                                            <TextInput id="inventoryItems_name" type="text" disabled={true}
                                                       readOnly={true} name="name"
                                                       value={inventoryItem.data.name}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_name_eng" value={StringHelper.__("Name ENG")}/>
                                            <TextInput id="inventoryItems_name_eng" type="text" disabled={true}
                                                       readOnly={true} name="name_eng"
                                                       value={inventoryItem.data.nameEng}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_formula">{StringHelper.__("Formula")}</InputLabel>
                                            <TextInput id="inventoryItems_formula" type="text" name="formula"
                                                       disabled={true} readOnly={true}
                                                       value={inventoryItem.data.formula}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_cas_nr">{StringHelper.__("CAS NR")}</InputLabel>
                                            <TextInput id="inventoryItems_cas_nr" type="text" name="cas_nr"
                                                       disabled={true} readOnly={true}
                                                       value={inventoryItem.data.casNr}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_user_guide">{StringHelper.__("User guide")}</InputLabel>
                                            <TextInput id="inventoryItems_user_guide" type="text" name="user_guide"
                                                       disabled={true} readOnly={true}
                                                       value={inventoryItem.data.userGuide}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <AccordionWithManualIndex expandedByDefault={openAll} indexOfAcc={3}
                                                          headerName={StringHelper.__("Amount")}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_total_amount" value={StringHelper.__("Count")}/>
                                            <TextInput id="inventoryItems_total_amount" type="text" disabled={true}
                                                       readOnly={true} name="total_amount"
                                                       value={inventoryItem.data.totalAmount || ''}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_critical_amount"
                                                        value={StringHelper.__("Critical amount")}/>
                                            <TextInput id="inventoryItems_critical_amount" type="text"
                                                       disabled={true} readOnly={true}
                                                       name="critical_amount"
                                                       value={inventoryItem.data.criticalAmount || ''}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_to_order" value={StringHelper.__("To order")}/>
                                            <TextInput id="inventoryItems_to_order" type="text" disabled={true}
                                                       readOnly={true} name="to_order"
                                                       value={inventoryItem.data.toOrderAmount || ''}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_average_consumption"
                                                        value={StringHelper.__("Average consumption")}/>
                                            <TextInput id="inventoryItems_average_consumption" type="text"
                                                       disabled={true} readOnly={true}
                                                       name="average_consumption"
                                                       value={inventoryItem.data.averageConsumption || ''}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <AccordionWithManualIndex expandedByDefault={openAll} indexOfAcc={2}
                                                          headerName={StringHelper.__("Order information")}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_product_code"
                                                        value={StringHelper.__("Product code")}/>
                                            <TextInput id="inventoryItems_product_code" type="text" disabled={true}
                                                       readOnly={true} name="product_code"
                                                       value={inventoryItem.data.productCode || ''}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_barcode" value={StringHelper.__("Barcode")}/>
                                            <TextInput id="inventoryItems_barcode" type="text" name="barcode"
                                                       disabled={true} readOnly={true}
                                                       value={inventoryItem.data.barcode || ''}
                                                       className="mt-1 w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_provider" value={StringHelper.__("Provider")}/>
                                            <TextInput id="inventoryItems_provider" type="text" disabled={true}
                                                       readOnly={true} name="provider"
                                                       value={inventoryItem.data.provider || ''}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_provider_url"
                                                        value={StringHelper.__("Provider url")}/>
                                            <ClickableUrlInput id="inventoryItems_provider_url" name="provider_url"
                                                               url={inventoryItem.data.urlToProviderSite || ''}
                                                               className="mt-1 block w-full"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_alt_url_to_provider"
                                                        value={StringHelper.__("Alt url to provider")}/>
                                            <ClickableUrlInput id="inventoryItems_alt_url_to_provider"
                                                               name="alt_url_to_provider"
                                                               url={inventoryItem.data.altUrlToProviderSite || ''}
                                                               className="mt-1 block w-full"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <AccordionWithManualIndex expandedByDefault={openAll} indexOfAcc={4} headerName={StringHelper.__("Location")}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_local_laboratory"
                                                        value={StringHelper.__("Laboratory")}/>

                                            <SelectForSingleItem value={inventoryItem.data.laboratory || ''}
                                                                 className="disabled:text-white disabled:bg-gray-500"
                                                                 options={laboratories.data} disabled={true}
                                                                 name="inventory_type"
                                                                 id="inventoryItems_inventory_type"
                                                                 noValueText={StringHelper.__("Choose a value")}/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_cupboard" value={StringHelper.__("Cupboard")}/>
                                            <TextInput id="inventoryItems_cupboard" type="text" disabled={true}
                                                       readOnly={true} name="cupboard"
                                                       value={inventoryItem.data.cupboard || ''}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_shelf" value={StringHelper.__("Shelf")}/>
                                            <TextInput id="inventoryItems_shelf" type="text" disabled={true}
                                                       readOnly={true} name="shelf"
                                                       value={inventoryItem.data.shelf || ''}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_multiple_locations"
                                                        value={StringHelper.__("Multiple locations")}/>
                                            <Checkbox checked={inventoryItem.data.multipleLocations} disabled={true}
                                                      readOnly={true}
                                                      className="mt-1 block w-6 h-6 disabled:bg-gray-400 disabled:hover:bg-gray-400"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <AccordionWithManualIndex expandedByDefault={openAll} indexOfAcc={5} headerName={StringHelper.__("Additional information")}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_storage_conditions"
                                                        value={StringHelper.__("Storage conditions")}/>
                                            <TextInputExtra id="inventoryItems_storage_conditions"
                                                            name="storage_conditions" type="textarea"
                                                            disabled={true} readOnly={true} value={inventoryItem.data.storageConditions || ''}
                                                            className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_used_for"
                                                        value={StringHelper.__("Used for")}/>
                                            <TextInputExtra id="inventoryItems_used_for" name="used_for"
                                                            type="textarea" disabled={true} readOnly={true} value={inventoryItem.data.usedFor || ''}
                                                            className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_comments"
                                                        value={StringHelper.__("Comments")}/>
                                            <TextInputExtra id="inventoryItems_comments" name="comments"
                                                            type="textarea" disabled={true} readOnly={true} value={inventoryItem.data.comments || ''}
                                                            className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <div className="mt-4">
                                    <Link href={route('inventoryItems.index')}
                                          className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        {StringHelper.__("Cancel")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
