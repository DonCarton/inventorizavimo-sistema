import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import {Accordion, AccordionBody, AccordionHeader} from "@material-tailwind/react";
import {useState} from "react";
import {__} from "@/Libs/Lang.jsx";
import SelectForSingleItem from "@/Components/Forms/SelectForSingleItem.jsx";
import NumericInput from "@/Components/Forms/NumericInput.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import Icon from "@/Components/Icon.jsx";

export default function Edit({auth, inventoryItem, role, laboratories, itemTypes}) {
    const {data, setData, put, errors, reset, processing} = useForm({
        local_name: inventoryItem.data.local_name || '',
        inventory_type: inventoryItem.data.inventory_type || '',
        name: inventoryItem.data.name || '',
        url_to_provider: inventoryItem.data.url_to_provider_site,
        total_count: inventoryItem.data.total_amount || 0,
        critical_amount: inventoryItem.data.critical_amount || 0,
        name_eng: inventoryItem.data.name_eng || '',
        provider: inventoryItem.data.provider || '',
        laboratory: inventoryItem.data.laboratory,
        cupboard: inventoryItem.data.cupboard,
        shelf: inventoryItem.data.shelf
    })
    const inventoryTypeDetails = inventoryItem.data.inventory_type;
    const [open, setOpen] = useState(1);
    const [open2, setOpen2] = useState(0);
    const [open3, setOpen3] = useState(0);
    const [open4, setOpen4] = useState(0);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    const handleOpen2 = (value) => setOpen2(open2 === value ? 0 : value);
    const handleOpen3 = (value) => setOpen3(open3 === value ? 0 : value);
    const handleOpen4 = (value) => setOpen4(open4 === value ? 0 : value);
    const onSubmit = (e) => {
        e.preventDefault();

        put(route('inventoryItems.update', inventoryItem.data.id));
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Redaguoti
                        - {inventoryItem.data.name}</h2>
                </div>
            }
            role={role}
        >
            <Head title={__("Edit")+ ' - ' + inventoryItem.data.name}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="pb-6">
                                <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
                                    <AccordionHeader onClick={() => handleOpen(1)}>{__("Amount")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4 w-full">
                                                <InputLabel htmlFor="inventoryItems_total_amount" value="Kiekis"/>
                                                <NumericInput id="inventoryItems_total_amount" type="text" name="total_amount" value={data.total_count} className="mt-1 block w-full" onChange={e => setData('total_count', e.target.value)} />
                                                {/*<TextInput id="inventoryItems_total_amount" type="text" name="total_amount" value={data.total_amount} className="mt-1 block w-full" onChange={e => setData('total_amount', e.target.value)}/>*/}
                                            </div>
                                            <div className="mt-4 w-full">
                                                <InputLabel htmlFor="inventoryItems_critical_amount"
                                                            value="Kritinis kiekis"/>
                                                <TextInput id="inventoryItems_critical_amount" type="text"
                                                           name="critical_amount" value={data.critical_amount}
                                                           className="mt-1 block w-full"
                                                           onChange={e => setData('critical_amount', e.target.value)}/>
                                                <InputError message={errors.critical_amount} className="mt-2"/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open2 === 2} icon={<Icon id={2} open={open2} />}>
                                    <AccordionHeader onClick={() => handleOpen2(2)}>{__("Location")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_local_laboratory" value={__("Laboratory")}/>
                                                <SelectForSingleItem id="inventoryItems_local_laboratory" name="laboratory" value={data.laboratory} onChange={e => setData('laboratory', e.target.value)} options={laboratories.data} noValueText={__("Choose a value")}/>
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
                                            </div>
                                        </AccordionBody>
                                </Accordion>
                                <Accordion open={open3 === 3} icon={<Icon id={3} open={open3} />}>
                                    <AccordionHeader onClick={() => handleOpen3(3)}>{__("Inventory information")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_local_name">{__("Barcode")}</InputLabel>
                                                <TextInput readOnly={true} disabled={true}
                                                           id="inventoryItems_local_name"
                                                           type="text" name="local_name" value={data.local_name}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_inventory_type">{__("Type")}</InputLabel>
                                                <SelectForSingleItem className="disabled:text-white disabled:bg-gray-400" disabled={true} id="inventoryItems_inventory_type" name="inventory_type" value={data.inventory_type} options={itemTypes.data} noValueText={__("Choose a value")} />
                                            </div>
                                            { inventoryItem.data.asset_number !== null ? <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_asset_number" value={__("Asset number")}/>
                                                <TextInput id="inventoryItems_asset_number" type="text" disabled={true}
                                                           readOnly={true} name="asset_number"
                                                           value={inventoryItem.data.asset_number}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div> : <></>}
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name" value={__("Name")}/>
                                                <TextInput id="inventoryItems_name" type="text" name="name"
                                                           value={data.name} className="mt-1 block w-full"
                                                           onChange={e => setData('name', e.target.value)}/>
                                                <InputError message={errors.name} className="mt-2"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name_eng" value={__("Name ENG")}/>
                                                <TextInput id="inventoryItems_name_eng" type="text" name="name_eng"
                                                           value={data.name_eng} className="mt-1 block w-full"
                                                           onChange={e => setData('name_eng', e.target.value)}/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open4 === 4}  icon={<Icon id={4} open={open4} />}>
                                    <AccordionHeader onClick={() => handleOpen4(4)}>{__("Order information")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_provider" value="Tiekėjas"/>
                                                <TextInput id="inventoryItems_provider" type="text" name="provider"
                                                           value={data.provider} className="mt-1 block w-full"
                                                           onChange={e => setData('provider', e.target.value)}/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_provider_url"
                                                            value="Tiekėjo nuoroda"/>
                                                <TextInput id="inventoryItems_provider_url" type="text"
                                                           name="provider_url"
                                                           value={data.provider_url} className="mt-1 block w-full"
                                                           onChange={e => setData('provider_url', e.target.value)}/>
                                                <InputError message={errors.provider_url} className="mt-2"/>
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
