import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import {Accordion, AccordionBody, AccordionHeader} from "@material-tailwind/react";
import {useState} from "react";
import {__} from "@/Libs/Lang.jsx";

export default function Edit({auth, inventoryItem, role, laboratories}) {
    const [open, setOpen] = useState(1);
    const [open2, setOpen2] = useState(true);
    const [open3, setOpen3] = useState(true);
    const [open4, setOpen4] = useState(true);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    const handleOpen2 = () => setOpen2((cur) => !cur);
    const handleOpen3 = () => setOpen3((cur) => !cur);
    const handleOpen4 = () => setOpen4((cur) => !cur);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Show")} - {inventoryItem.data.name}</h2>
                </div>
            }
            role={role}
        >
            <Head title={__("Show")+ ' - ' + inventoryItem.data.name}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="pb-6">
                                <Accordion open={open3}>
                                    <AccordionHeader onClick={handleOpen3}>{__("Inventory information")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_local_name">{__("Barcode")}</InputLabel>
                                                <TextInput
                                                    id="inventoryItems_local_name"
                                                    type="text" disabled={true} readOnly={true} name="local_name" value={inventoryItem.data.local_name}
                                                    className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_local_name">{__("Type")}</InputLabel>
                                                <TextInput
                                                    id="inventoryItems_local_name"
                                                    type="text" disabled={true} readOnly={true} name="local_name" value={inventoryItem.data.inventory_type.name}
                                                    className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name" value="Pavadinimas"/>
                                                <TextInput id="inventoryItems_name" type="text" disabled={true} readOnly={true} name="name"
                                                           value={inventoryItem.data.name} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name_eng" value="Pavadinimas ENG"/>
                                                <TextInput id="inventoryItems_name_eng" type="text" disabled={true} readOnly={true} name="name_eng"
                                                           value={inventoryItem.data.name_eng} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open4}>
                                    <AccordionHeader onClick={handleOpen4}>{__("Order information")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_provider" value="Tiekėjas"/>
                                                <TextInput id="inventoryItems_provider" type="text" disabled={true} readOnly={true} name="provider"
                                                           value={inventoryItem.data.provider} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_provider_url"
                                                            value="Tiekėjo nuoroda"/>
                                                <TextInput id="inventoryItems_provider_url" type="text"
                                                           name="provider_url" disabled={true} readOnly={true}
                                                           value={inventoryItem.data.provider_url} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open === 1}>
                                    <AccordionHeader onClick={() => handleOpen(1)}>{__("Amount")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4 w-full">
                                                <InputLabel htmlFor="inventoryItems_total_amount" value="Kiekis"/>
                                                <TextInput id="inventoryItems_total_amount" type="text" disabled={true} readOnly={true} name="total_amount" value={inventoryItem.data.total_amount} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4 w-full">
                                                <InputLabel htmlFor="inventoryItems_critical_amount"
                                                            value="Kritinis kiekis"/>
                                                <TextInput id="inventoryItems_critical_amount" type="text" disabled={true} readOnly={true}
                                                           name="critical_amount" value={inventoryItem.data.critical_amount}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open2}>
                                    <AccordionHeader onClick={handleOpen2}>{__("Location")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_local_laboratory" value={__("Laboratory")}/>
                                                <TextInput id="inventoryItems_local_laboratory" type="text" disabled={true} readOnly={true}
                                                           name="laboratory" value={inventoryItem.data.laboratory}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_cupboard" value={__("Cupboard")}/>
                                                <TextInput id="inventoryItems_cupboard" type="text" disabled={true} readOnly={true} name="cupboard"
                                                           value={inventoryItem.data.cupboard} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_shelf" value={__("Shelf")}/>
                                                <TextInput id="inventoryItems_shelf" type="text" disabled={true} readOnly={true} name="shelf"
                                                           value={inventoryItem.data.shelf} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <div className="mt-4">
                                    <Link href={route('inventoryItems.index')} className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">{__("Cancel")}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
