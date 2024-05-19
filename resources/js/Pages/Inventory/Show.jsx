import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import {Accordion, AccordionBody, AccordionHeader} from "@material-tailwind/react";
import {useState} from "react";
import {__} from "@/Libs/Lang.jsx";
import { FaDownload } from 'react-icons/fa';
import SelectForSingleItem from "@/Components/Forms/SelectForSingleItem.jsx";
import Icon from "@/Components/Icon.jsx";
import NumericInput from "@/Components/Forms/NumericInput.jsx";

export default function Show({auth, inventoryItem, role, laboratories, itemTypes}) {
    const [open, setOpen] = useState(1);
    const [open2, setOpen2] = useState(0);
    const [open3, setOpen3] = useState(3);
    const [open4, setOpen4] = useState(0);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    const handleOpen2 = (value) => setOpen2(open2 === value ? 0 : value);
    const handleOpen3 = (value) => setOpen3(open3 === value ? 0 : value);
    const handleOpen4 = (value) => setOpen4(open4 === value ? 0 : value);
    // const handleOpen2 = () => setOpen2((cur) => !cur);
    // const handleOpen3 = () => setOpen3((cur) => !cur);
    // const handleOpen4 = () => setOpen4((cur) => !cur);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Show")} - {inventoryItem.data.name}</h2>
                    <a
                        href={route("getBarcodePng", inventoryItem.data.local_name)}
                        className="inline-flex items-center px-4 py-2 bg-pink-800 text-white font-semibold text-sm rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75"
                    >
                        <FaDownload className="mr-2"/>
                        {__("Local barcode")}
                    </a>
                </div>
            }
            role={role}
        >
            <Head title={__("Show") + ' - ' + inventoryItem.data.name}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="pb-6">
                                <Accordion open={open === 1} icon={<Icon id={1} open={open}/>}>
                                    <AccordionHeader
                                        onClick={() => handleOpen(1)}>{__("Inventory information")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_local_name">{__("Local name")}</InputLabel>
                                                <TextInput
                                                    id="inventoryItems_local_name"
                                                    type="text" disabled={true} readOnly={true} name="local_name"
                                                    value={inventoryItem.data.local_name}
                                                    className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_inventory_type">{__("Type")}</InputLabel>
                                                <SelectForSingleItem value={inventoryItem.data.inventory_type} className="disabled:text-white disabled:bg-gray-400" options={itemTypes.data} disabled={true} name="inventory_type" id="inventoryItems_inventory_type" noValueText={__("Choose a value")}/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name" value="Pavadinimas"/>
                                                <TextInput id="inventoryItems_name" type="text" disabled={true}
                                                           readOnly={true} name="name"
                                                           value={inventoryItem.data.name}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name_eng" value="Pavadinimas ENG"/>
                                                <TextInput id="inventoryItems_name_eng" type="text" disabled={true}
                                                           readOnly={true} name="name_eng"
                                                           value={inventoryItem.data.name_eng}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open3 === 3} icon={<Icon id={3} open={open3} />}>
                                    <AccordionHeader onClick={() => handleOpen3(3)}>{__("Amount")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4 w-full">
                                                <InputLabel htmlFor="inventoryItems_total_amount" value={__("Count")}/>
                                                <TextInput id="inventoryItems_total_amount" type="text" disabled={true}
                                                           readOnly={true} name="total_amount"
                                                           value={inventoryItem.data.total_amount}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4 w-full">
                                                <InputLabel htmlFor="inventoryItems_critical_amount"
                                                            value={__("Critical amount")}/>
                                                <TextInput id="inventoryItems_critical_amount" type="text"
                                                           disabled={true} readOnly={true}
                                                           name="critical_amount"
                                                           value={inventoryItem.data.critical_amount}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4 w-full">
                                                <InputLabel htmlFor="inventoryItems_to_order" value={__("To order")}/>
                                                <TextInput id="inventoryItems_to_order" type="text" disabled={true}
                                                           readOnly={true} name="to_order"
                                                           value={inventoryItem.data.to_order}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4 w-full">
                                                <InputLabel htmlFor="inventoryItems_average_consumption"
                                                            value={__("Average consumption")}/>
                                                <TextInput id="inventoryItems_average_consumption" type="text"
                                                           disabled={true} readOnly={true}
                                                           name="average_consumption"
                                                           value={inventoryItem.data.average_consumption}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open2 === 2} icon={<Icon id={2} open={open2}/>}>
                                    <AccordionHeader onClick={() => handleOpen2(2)}>{__("Order information")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_provider" value="Tiekėjas"/>
                                                <TextInput id="inventoryItems_provider" type="text" disabled={true}
                                                           readOnly={true} name="provider"
                                                           value={inventoryItem.data.provider}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_provider_url"
                                                            value="Tiekėjo nuoroda"/>
                                                <TextInput id="inventoryItems_provider_url" type="text"
                                                           name="provider_url" disabled={true} readOnly={true}
                                                           value={inventoryItem.data.provider_url}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open4 === 4} icon={<Icon id={4} open={open4}/> }>
                                    <AccordionHeader onClick={() => handleOpen4(4)}>{__("Location")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_local_laboratory"
                                                            value={__("Laboratory")}/>

                                                <SelectForSingleItem value={inventoryItem.data.laboratory} className="disabled:text-white disabled:bg-gray-400" options={laboratories.data} disabled={true} name="inventory_type" id="inventoryItems_inventory_type" noValueText={__("Choose a value")}/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_cupboard" value={__("Cupboard")}/>
                                                <TextInput id="inventoryItems_cupboard" type="text" disabled={true}
                                                           readOnly={true} name="cupboard"
                                                           value={inventoryItem.data.cupboard}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_shelf" value={__("Shelf")}/>
                                                <TextInput id="inventoryItems_shelf" type="text" disabled={true}
                                                           readOnly={true} name="shelf"
                                                           value={inventoryItem.data.shelf}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <div className="mt-4">
                                    <Link href={route('inventoryItems.index')}
                                          className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        {__("Cancel")}
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
