import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import {Accordion, AccordionBody, AccordionHeader} from "@material-tailwind/react";
import {useState} from "react";

export default function Edit({auth, inventoryItem}) {
    const {data, setData, put, errors, reset} = useForm({
        local_name: inventoryItem.data.local_name || '',
        name: inventoryItem.data.name || '',
        provider_url: inventoryItem.data.url_to_provider_site,
        total_amount: inventoryItem.data.total_amount || 0,
        critical_amount: inventoryItem.data.critical_amount || 0,
        name_eng: inventoryItem.data.name_eng || '',
        provider: inventoryItem.data.provider || '',
        laboratory: inventoryItem.data.laboratory,
        cupboard: inventoryItem.data.cupboard,
        shelf: inventoryItem.data.shelf,
    })
    const [open, setOpen] = useState(1);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    const handleOpen2 = () => setOpen2((cur) => !cur);
    const handleOpen3 = () => setOpen3((cur) => !cur);
    const handleOpen4 = () => setOpen4((cur) => !cur);
    const onSubmit = (e) => {
        e.preventDefault();

        put(route('inventoryItems.update', inventoryItem.data.id));
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Redaguoti - {inventoryItem.data.name}</h2>
                </div>
            }
        >
            <Head title={'Redaguoti - '+inventoryItem.data.name}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="pb-6">
                                <Accordion open={open === 1} onClick={() => handleOpen(1)}>
                                    <AccordionHeader>Kiekis</AccordionHeader>
                                    <AccordionBody>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_total_amount" value="Kiekis"/>
                                            <TextInput id="inventoryItems_total_amount" type="text" name="total_amount" value={data.total_amount} className="mt-1 block w-full" onChange={e => setData('total_amount', e.target.value)}/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_critical_amount" value="Kritinis kiekis"/>
                                            <TextInput id="inventoryItems_critical_amount" type="text" name="critical_amount" value={data.critical_amount} className="mt-1 block w-full" onChange={e => setData('critical_amount', e.target.value)}/>
                                            <InputError message={errors.critical_amount} className="mt-2"/>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open2}>
                                    <AccordionHeader onClick={handleOpen2}>Vieta</AccordionHeader>
                                    <div>
                                    <AccordionBody>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_local_laboratory" value="Patalpa"/>
                                            <TextInput id="inventoryItems_local_laboratory" type="text" name="laboratory" value={data.laboratory} className="mt-1 block w-full" onChange={e => setData('laboratory', e.target.value)}/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_cupboard" value="Spinta"/>
                                            <TextInput id="inventoryItems_cupboard" type="text" name="cupboard" value={data.cupboard} className="mt-1 block w-full" onChange={e => setData('cupboard', e.target.value)} />
                                            <InputError message={errors.cupboard} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_shelf" value="Lentyna"/>
                                            <TextInput id="inventoryItems_shelf" type="text" name="shelf" value={data.shelf} className="mt-1 block w-full" onChange={e => setData('shelf', e.target.value)}/>
                                        </div>
                                    </AccordionBody>
                                    </div>
                                </Accordion>
                                <Accordion open={open3}>
                                    <AccordionHeader onClick={handleOpen3}>Inventoriaus informacija</AccordionHeader>
                                    <AccordionBody>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_local_name" value="Vietinis pavadinimas"/>
                                            <TextInput id="inventoryItems_local_name" type="text" name="local_name" value={data.local_name} className="mt-1 block w-full" onChange={e => setData('local_name', e.target.value)}/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_name" value="Pavadinimas"/>
                                            <TextInput id="inventoryItems_name" type="text" name="name" value={data.name} className="mt-1 block w-full" onChange={e => setData('name', e.target.value)}/>
                                            <InputError message={errors.name} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_name_eng" value="Pavadinimas ENG"/>
                                            <TextInput id="inventoryItems_name_eng" type="text" name="name_eng" value={data.name_eng} className="mt-1 block w-full" onChange={e => setData('name_eng', e.target.value)}/>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open4}>
                                    <AccordionHeader onClick={handleOpen4}>Užsakymo informacija</AccordionHeader>
                                    <AccordionBody>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_provider" value="Tiekėjas"/>
                                            <TextInput id="inventoryItems_provider" type="text" name="provider" value={data.provider} className="mt-1 block w-full" onChange={e => setData('provider', e.target.value)}/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_provider_url" value="Tiekėjo nuoroda"/>
                                            <TextInput id="inventoryItems_provider_url" type="text" name="provider_url" value={data.provider_url} className="mt-1 block w-full" onChange={e => setData('provider_url', e.target.value)} />
                                            <InputError message={errors.provider_url} className="mt-2" />
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <div className="mt-4">
                                    <Link href={route('inventoryItems.index')}
                                          className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                                        Update
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
