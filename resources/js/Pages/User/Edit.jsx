import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Icon from "@/Components/Icon.jsx";
import InputError from "@/Components/InputError.jsx";
import {Accordion, AccordionBody, AccordionHeader} from "@material-tailwind/react";
import {useState} from "react";
import {__} from "@/Libs/Lang.jsx";

export default function Edit({auth, inventoryItem}) {
    const {data, setData, patch, errors, reset} = useForm({
        total_amount: inventoryItem.data.total_amount,
        amount_added: '',
        amount_removed: '',
    })
    const inventoryTypeDetails = inventoryItem.data.inventory_type;
    const [open, setOpen] = useState(1);
    const [open2, setOpen2] = useState(0);
    const [addingAllowed, setAddingAllowed] = useState(true);
    const [removingAllowed, setRemovingAllowed] = useState(true);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    const handleOpen2 = (value) => setOpen2(open2 === value ? 0 : value);
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
        if (data.amount_removed > data.total_amount){
            console.log("Don't remove more than you can take");
        }
        patch(route('inventoryItems.updateAmount', inventoryItem.data.id));
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
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Change amount")} - {inventoryItem.data.local_name} - {inventoryItem.data.name}</h2>
                </div>
            }
        >
            <Head title={__("Change amount")+ ' - ' + inventoryItem.data.local_name}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div>
                            <pre> {JSON.stringify(inventoryItem, undefined, 2)} </pre>
                        </div>
                        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="pb-6">
                                <Accordion open={open === 1} icon={<Icon id={1} open={open}/>}>
                                    <AccordionHeader onClick={() => handleOpen(1)}>{__("Amount")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4 w-full">
                                                <InputLabel htmlFor="inventoryItems_total_amount" value={__("Count")}/>
                                                <TextInput id="inventoryItems_total_amount" type="text" name="total_amount" value={data.total_amount} className="mt-1 block w-full disabled:bg-gray-400 text-white" readOnly={true} disabled={true}/>
                                            </div>
                                            <div className={removingAllowed ? "mt-4 w-full" : "hidden"}>
                                                <InputLabel htmlFor="inventoryItems_amount_removed">{__("Amount being taken out")}</InputLabel>
                                                <TextInput id="inventoryItems_amount_removed" type="text" name="amount_removed" className="mt-1 block w-full bg-red-400 text-white disabled:bg-gray-400" onChange={handleAmountChangeForRemoving}
                                                    disabled={!removingAllowed} onKeyPress={handleNumericInput}
                                                />
                                                <InputError message={errors.amount_removed} className="mt-2"/>
                                            </div>
                                            <div className="mt-4 w-full">
                                                <InputLabel htmlFor="inventoryItems_critical_amount" value={__("Critical amount")}/>
                                                <TextInput id="inventoryItems_critical_amount" type="text" name="critical_amount" value={inventoryItem.data.critical_amount} className="mt-1 block w-full disabled:bg-gray-400 text-white" readOnly={true} disabled={true}/>
                                            </div>
                                            <div className={addingAllowed ? "mt-4 w-full" : "hidden"}>
                                                <InputLabel htmlFor="inventoryItems_amount_added">{__("Amount being added")}</InputLabel>
                                                <TextInput id="inventoryItems_amount_added" type="text" name="amount_added" className="mt-1 block w-full bg-emerald-500 text-white disabled:bg-gray-400" onChange={handleAmountChangeForAdding} disabled={!addingAllowed} onKeyPress={handleNumericInput}/>
                                                <InputError message={errors.amount_added} className="mt-2"/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open2 === 2} icon={<Icon id={2} open={open2}/>}>
                                    <AccordionHeader onClick={() => handleOpen2(2)}>{__("Inventory information")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_local_name">{__("Barcode")}</InputLabel>
                                                <TextInput readOnly={true} disabled={true}
                                                           id="inventoryItems_local_name"
                                                           type="text" name="local_name" value={inventoryItem.data.local_name}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_type">{__("Type")}</InputLabel>
                                                <TextInput readOnly={true} disabled={true} id="inventoryItems_type" type="text" name="type" value={inventoryItem.data.inventory_type.name} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name" value="Pavadinimas"/>
                                                <TextInput id="inventoryItems_name" type="text" name="name" value={inventoryItem.data.name} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white" readOnly={true} disabled={true}/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name_eng" value="Pavadinimas ENG"/>
                                                <TextInput id="inventoryItems_name_eng" type="text" name="name_eng" value={inventoryItem.data.name_eng} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white" readOnly={true} disabled={true}/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <div className="mt-4">
                                    <Link href={route('inventoryItems.index')}
                                          className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                                    >
                                        {__("Cancel")}
                                    </Link>
                                    <button
                                        className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                                        {__("Save")}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
