import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import {useState} from "react";
import {Accordion, AccordionBody, AccordionHeader} from "@material-tailwind/react";

function Icon({ id, open }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}

export default function Create({auth}) {
    const [open, setOpen] = useState(0);
    const [open2, setOpen2] = useState(false);
    const {data, setData, post, errors} = useForm({
        local_name: '',
        name: '',
        provider_url: '',
        total_amount: '',
        critical_amount: '',
        name_eng: '',
        provider: '',
        laboratory: '',
        cupboard: '',
        shelf: '',
        barcode: 1,
        created_by: 1,
        updated_by: 1
    })

    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    const handleOpen2 = () => setOpen2((cur) => !cur);
    const handleOpen3 = () => setOpen2((cur) => !cur);
    const handleOpen4 = () => setOpen2((cur) => !cur);
    const onSubmit = (e) => {
        e.preventDefault();

        post(route('inventoryItems.store'));
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create new
                        inventory item</h2>
                </div>
            }
        >
            <Head title="Inventory items"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="pb-6">
                                <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
                                    <AccordionHeader onClick={() => handleOpen(1)}>Inventoriaus informacija</AccordionHeader>
                                    <AccordionBody>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_local_name" value="Vietinis pavadinimas"/>
                                            <TextInput id="inventoryItems_local_name" type="text" name="local_name" value={data.local_name} className="mt-1 block w-full" isFocused={true} onChange={e => setData('local_name', e.target.value)}/>
                                            <InputError message={errors.local_name} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_name" value="Pavadinimas"/>
                                            <TextInput id="inventoryItems_name" type="text" name="name" value={data.name} className="mt-1 block w-full" onChange={e => setData('name', e.target.value)}/>
                                            <InputError message={errors.name} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="inventoryItems_name_eng" value="Pavadinimas ENG" />
                                            <TextInput id="inventoryItems_name_eng" type="text" name="name_eng" value={data.name_eng} className="mt-1 block w-full" onChange={e => setData('name_eng', e.target.value)} />
                                            <InputError message={errors.name_eng} className="mt-2"/>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
                                {/*<Accordion open={open2}>*/}
                                    <AccordionHeader onClick={() => handleOpen(2)}>Užsakymo informacija</AccordionHeader>
                                        <AccordionBody>
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_provider"
                                                    value="Tiekėjas"
                                                />
                                                <TextInput
                                                    id="inventoryItems_provider"
                                                    type="text"
                                                    name="provider"
                                                    value={data.provider}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={e => setData('provider', e.target.value)}
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_provider_url"
                                                    value="Tiekėjo nuoroda"
                                                />
                                                <TextInput
                                                    id="inventoryItems_provider_url"
                                                    type="text"
                                                    name="provider_url"
                                                    value={data.provider_url}
                                                    className="mt-1 block w-full"
                                                    onChange={e => setData('provider_url', e.target.value)}
                                                />
                                                <InputError
                                                    message={errors.provider_url} className="mt-2"
                                                />
                                            </div>
                                        </AccordionBody>
                                </Accordion>
                                <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
                                    <AccordionHeader onClick={() => handleOpen(3)}>Kiekis</AccordionHeader>
                                    <AccordionBody>
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_total_amount"
                                                value="Kiekis"
                                                className="required:border-red-600"
                                            />
                                            <TextInput
                                                id="inventoryItems_total_amount"
                                                type="text"
                                                name="total_amount"
                                                value={data.total_amount}
                                                className="mt-1 block w-full"
                                                isFocused={true}
                                                onChange={e => setData('total_amount', e.target.value)}
                                            />
                                            <InputError message={errors.total_amount} className="mt-2"/>
                                        </div>
                                        {/*<div className="mt-4">*/}
                                        {/*    <InputLabel*/}
                                        {/*        htmlFor="inventoryItems_critical_amount"*/}
                                        {/*        value="Naudojamas kiekis"*/}
                                        {/*    />*/}
                                        {/*    <TextInput*/}
                                        {/*        id="inventoryItems_critical_amount"*/}
                                        {/*        type="text"*/}
                                        {/*        name="critical_amount"*/}
                                        {/*        value={data.critical_amount}*/}
                                        {/*        className="mt-1 block w-full"*/}
                                        {/*        onChange={e => setData('critical_amount', e.target.value)}*/}
                                        {/*    />*/}
                                        {/*    <InputError*/}
                                        {/*        message={errors.critical_amount} className="mt-2"*/}
                                        {/*    />*/}
                                        {/*</div>*/}
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_critical_amount"
                                                value="Kritinis kiekis"
                                                className="required:border-red-600"
                                            />
                                            <TextInput
                                                id="inventoryItems_critical_amount"
                                                type="text"
                                                name="critical_amount"
                                                value={data.critical_amount}
                                                className="mt-1 block w-full"
                                                onChange={e => setData('critical_amount', e.target.value)}
                                            />
                                            <InputError message={errors.critical_amount} className="mt-2"/>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open === 4} icon={<Icon id={4} open={open} />}>
                                    <AccordionHeader onClick={() => handleOpen(4)}>Vieta</AccordionHeader>
                                    <AccordionBody>
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_local_laboratory"
                                                value="Patalpa"
                                            />
                                            <TextInput
                                                id="inventoryItems_local_laboratory"
                                                type="text"
                                                name="laboratory"
                                                value={data.laboratory}
                                                className="mt-1 block w-full"
                                                isFocused={true}
                                                onChange={e => setData('laboratory', e.target.value)}
                                            />
                                            <InputError message={errors.laboratory} className="mt-2"/>
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_cupboard"
                                                value="Spinta"
                                            />
                                            <TextInput
                                                id="inventoryItems_cupboard"
                                                type="text"
                                                name="cupboard"
                                                value={data.cupboard}
                                                className="mt-1 block w-full"
                                                onChange={e => setData('cupboard', e.target.value)}
                                            />
                                            <InputError
                                                message={errors.cupboard} className="mt-2"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="inventoryItems_shelf"
                                                value="Lentyna"
                                            />
                                            <TextInput
                                                id="inventoryItems_shelf"
                                                type="text"
                                                name="shelf"
                                                value={data.shelf}
                                                className="mt-1 block w-full"
                                                onChange={e => setData('shelf', e.target.value)}
                                            />
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                            </div>
                            <div className="mt-4">
                                <Link href={route('inventoryItems.index')}
                                      className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                                >
                                    Cancel
                                </Link>
                                <button
                                    className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
