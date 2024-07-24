import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import {useState} from "react";
import {__} from "@/Libs/Lang.jsx";
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";
import SelectForSingleItem from "@/Components/Forms/SelectForSingleItem.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import AccordionWithManualIndex from "@/Components/Forms/AccordionWithManualIndex.jsx";

export default function Edit({auth, inventoryItem, role, itemTypes, redirectToReader}) {
    const {data, setData, patch, errors, processing} = useForm({
        total_amount: inventoryItem.total_amount,
        amount_added: '',
        amount_removed: '',
        urlToRedirect: redirectToReader,
    })
    const [addingAllowed, setAddingAllowed] = useState(true);
    const [removingAllowed, setRemovingAllowed] = useState(true);
    const handleAmountChangeForAdding = (e) =>{
        if (removingAllowed){
            setRemovingAllowed(false);
        }
        setData('amount_added',e.target.value);
    }
    const handleAmountChangeForRemoving = (e) =>{
        if (addingAllowed){
            setAddingAllowed(false);
        }
        setData('amount_removed',e.target.value);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        patch(route('inventoryItems.updateAmount', inventoryItem.id));
    }
    const handleNumericInput = (e) =>{
        if (e.which < 48 || e.which > 57)
        { e.preventDefault(); }
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Change amount")} - {inventoryItem.local_name} - {inventoryItem.name}</h2>
                </div>
            }
            role={role}
        >
            <Head title={__("Change amount")+ ' - ' + inventoryItem.local_name}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg space-y-6">
                        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="pb-6">
                                <AccordionWithManualIndex indexOfAcc={1} headerName={__("Amount")}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_total_amount" value={__("Count")}/>
                                            <TextInput id="inventoryItems_total_amount" type="text"
                                                       name="total_amount" value={data.total_amount}
                                                       className="mt-1 block w-full disabled:bg-gray-400 text-white"
                                                       readOnly={true} disabled={true}/>
                                        </div>
                                        <div className={removingAllowed ? "mt-4 w-full" : "hidden"}>
                                            <InputLabel
                                                htmlFor="inventoryItems_amount_removed">{__("Amount being taken out")}</InputLabel>
                                            <div className="flex justify-between">
                                                <TextInput id="inventoryItems_amount_removed" type="text"
                                                           name="amount_removed"
                                                           className="mt-1 block w-full bg-red-400 text-white disabled:bg-gray-400"
                                                           onChange={handleAmountChangeForRemoving}
                                                           disabled={!removingAllowed}
                                                           onKeyPress={handleNumericInput}
                                                />
                                                <InformationIconToolTip classname="bg-black"
                                                                        content={__("In this field, the amount which will be removed is specified") + '.'}
                                                                        color="black"/>
                                            </div>
                                            <InputError message={errors.amount_removed} className="mt-2"/>
                                        </div>
                                        <div className="mt-4 w-full">
                                            <InputLabel htmlFor="inventoryItems_critical_amount"
                                                        value={__("Critical amount")}/>
                                            <TextInput id="inventoryItems_critical_amount" type="text"
                                                       name="critical_amount" value={inventoryItem.critical_amount}
                                                       className="mt-1 block w-full disabled:bg-gray-400 text-white"
                                                       readOnly={true} disabled={true}/>
                                        </div>
                                        <div className={addingAllowed ? "mt-4 w-full" : "hidden"}>
                                            <InputLabel
                                                htmlFor="inventoryItems_amount_added">{__("Amount being added")}</InputLabel>
                                            <div className="flex justify-between">
                                                <TextInput id="inventoryItems_amount_added" type="text"
                                                           name="amount_added"
                                                           className="mt-1 block w-full bg-emerald-500 text-white disabled:bg-gray-400"
                                                           onChange={handleAmountChangeForAdding}
                                                           disabled={!addingAllowed}
                                                           onKeyPress={handleNumericInput}/>
                                                <InformationIconToolTip classname="bg-black"
                                                                        content={__("In this field, the amount which will be added is specified") + '.'}
                                                                        color="black"/>
                                            </div>
                                            <InputError message={errors.amount_added} className="mt-2"/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <AccordionWithManualIndex indexOfAcc={2} headerName={__("Inventory information")}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_local_name">{__("Barcode")}</InputLabel>
                                            <TextInput readOnly={true} disabled={true}
                                                       id="inventoryItems_local_name"
                                                       type="text" name="local_name"
                                                       value={inventoryItem.local_name}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_type">{__("Type")}</InputLabel>
                                            <SelectForSingleItem id="inventoryItems_type"
                                                                 value={inventoryItem.inventory_type}
                                                                 options={itemTypes.data} disabled={true}
                                                                 className="disabled:text-white disabled:bg-gray-500"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_name" value="Pavadinimas"/>
                                            <TextInput id="inventoryItems_name" type="text" name="name"
                                                       value={inventoryItem.name}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"
                                                       readOnly={true} disabled={true}/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_name_eng" value="Pavadinimas ENG"/>
                                            <TextInput id="inventoryItems_name_eng" type="text" name="name_eng"
                                                       value={inventoryItem.name_eng}
                                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"
                                                       readOnly={true} disabled={true}/>
                                        </div>
                                    </div>
                                </AccordionWithManualIndex>
                                <div className="mt-4">
                                    {redirectToReader ? <Link href={route('reader')}
                                                              className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        {__("Cancel")}
                                    </Link> : <Link href={route('inventoryItems.index')}
                                                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        {__("Cancel")}
                                    </Link>}
                                    <PrimaryButton className="ml-2" disabled={processing}>{__("Save")}</PrimaryButton>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
