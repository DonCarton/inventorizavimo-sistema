import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import {useState} from "react";
import {Accordion, AccordionBody, AccordionHeader} from "@material-tailwind/react";
import {__} from "@/Libs/Lang.jsx";
import Checkbox from "@/Components/Checkbox.jsx";

function Icon({id, open}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
        </svg>
    );
}

export default function Create({auth,role}) {

    const [open, setOpen] = useState(0);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [checkbox, setCheckbox] = useState(false);
    const [postNumber, setPostNumber] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
    const [selectedPrefix, setSelectedPrefix] = useState('BIN');
    const [selectedMeasurement, setSelectedMeasurement] = useState('');
    const {data, formData, setData, post, processing, errors} = useForm({
        local_name: postNumber || '',
        name: '',
        name_eng: '',
        formula: '',
        cas_nr: '',
        provider: '',
        product_code: '',
        barcode: 1,
        url_to_provider: '',
        alt_url_to_provider: '',
        provider_url: '',
        total_count: '',
        critical_amount: '',
        multiple_locations: false,
        laboratory: '',
        created_by: 1,
        updated_by: 1
    });
    const prefixOptions = [
        {value: 'BIO', label: 'BIO'},
        {value: 'CHE', label: 'CHE'},
        {value: 'FIZ', label: 'FIZ'},
        {value: 'FAB', label: 'FAB'},
        {value: 'PRO', label: 'PRO'},
        {value: 'ROB', label: 'ROB'},
        {value: 'SVI', label: 'SVI'},
        {value: 'INZ', label: 'INZ'},
        {value: 'BEN', label: 'BEN'},
    ];
    const handlePrefixChange = async (e) => {
        if (e.target.value !== ''){
            const prefixId = e.target.value;
            setSelectedPrefix(prefixId);
            try {
                const response = await axios.post('/inventoryItems/fetch-post-number', { prefix_option_id: prefixId });
                // const response = await axios.post('/inventoryItems/general-identifier', {prefix_option_id: prefixId});
                const {post_number} = response.data;
                setPostNumber(post_number);
                setData('local_name', post_number);
            } catch (error) {
                console.error('Error fetching post number:', error.message);
            }
        }
    };
    const handleTabChange = (tabNumber) => {
        setActiveTab(tabNumber);
    };
    const handleCheckbox = (e) => {
        data.multiple_locations = data.multiple_locations === false;
    }
    const handleMeasureChoice = (e) => {
        if (e.target.value !== '') {
            let localName = postNumber;
            localName = localName + "-" + e.target.value;
            setSelectedMeasurement(e.target.value);
            setData('local_name', localName);
            setActiveTab(2);
            setOpen(1);
        } else {
            setSelectedMeasurement(e.target.value);
            setData('local_name', postNumber);
        }
    }
    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    const handleOpen2 = () => setOpen2((cur) => !cur);
    const handleOpen3 = () => setOpen3((cur) => !cur);
    const handleOpen4 = () => setOpen4((cur) => !cur);
    const onSubmit = (e) => {
        e.preventDefault();

        post(route('inventoryItems.store'));
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Create new inventory item")}</h2>
                </div>
            }
            role={role}
        >
            <Head title={__("Create new inventory item")}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/*{postNumber && ( <p>Next Post Number: {postNumber}</p> )}*/}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {activeTab === 1 && (
                            <div
                                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg grid grid-cols-2 gap-2">
                                {/*<div className="pb-6">*/}
                                <div>
                                    <InputLabel htmlFor="inventoryItems_unit" className="4xl:text-2xl 3xl:text-xl">
                                        {__("Choose where the item will be stored")}<span className="text-red-500">*</span>
                                    </InputLabel>
                                    <select className="rounded shadow mt-1 block w-3/4" value={selectedPrefix}
                                            onChange={handlePrefixChange}>
                                        <option value="">{__("Choose a value")}</option>
                                        {prefixOptions.map((prefixOption) => (
                                            <option key={prefixOption.id}
                                                    value={prefixOption.id}>{prefixOption.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel htmlFor="inventoryItems_unit" className="4xl:text-2xl 3xl:text-xl">
                                        {__("Storage measurement")}<span className="text-red-500">*</span>
                                    </InputLabel>
                                    <select id="inventoryItems_unit" disabled={!postNumber}
                                            className="rounded shadow mt-1 block w-64 disabled:bg-gray-600 disabled:text-white"
                                            value={selectedMeasurement}
                                            onChange={handleMeasureChoice}>
                                        <option id="0" value="">{__("Choose a value")}</option>
                                        <option id="1" value="L">{__("Litres")}</option>
                                        <option id="2" value="K">{__("Kilograms")}</option>
                                        <option id="3" value="P">{__("Packs")}</option>
                                    </select>
                                </div>
                                {/*</div>*/}
                            </div>
                        )}
                        {activeTab === 2 && (
                            <form onSubmit={onSubmit}
                                  className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                                <div className="pb-6">
                                    <Accordion open={open === 1} icon={<Icon id={1} open={open}/>}>
                                        <AccordionHeader onClick={() => handleOpen(1)}>Inventoriaus
                                            informacija</AccordionHeader>
                                        <AccordionBody>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_local_name">
                                                    {__("Barcode")}<span className="text-red-500">*</span>
                                                </InputLabel>
                                                <TextInput id="inventoryItems_local_name" type="text" name="local_name"
                                                           value={data.local_name}
                                                           onChange={e => setData('local_name', data.local_name)}
                                                           className="mt-1 block w-full"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name">
                                                    {__("Name")} <span className="text-red-500">*</span>
                                                </InputLabel>
                                                <TextInput id="inventoryItems_name" type="text" name="name"
                                                           value={data.name} className="mt-1 block w-full"
                                                           onChange={e => setData('name', e.target.value)}/>
                                                <InputError message={errors.name} className="mt-2"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name_eng">
                                                    {__("Name ENG")} <span className="text-red-500">*</span>
                                                </InputLabel>
                                                <TextInput id="inventoryItems_name_eng" type="text" name="name_eng"
                                                           value={data.name_eng} className="mt-1 block w-full"
                                                           onChange={e => setData('name_eng', e.target.value)}/>
                                                <InputError message={errors.name_eng} className="mt-2"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_formula">
                                                    {__("Formula")}
                                                </InputLabel>
                                                <TextInput id="inventoryItems_formula" type="text" name="name_eng"
                                                           value={data.formula} className="mt-1 block w-full"
                                                           onChange={e => setData('formula', e.target.value)}/>
                                                <InputError message={errors.name_eng} className="mt-2"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_cas_nr">
                                                    {__("CAS NR")}
                                                </InputLabel>
                                                <TextInput id="inventoryItems_cas_nr" type="text" name="name_eng"
                                                           value={data.formula} className="mt-1 block w-full"
                                                           onChange={e => setData('formula', e.target.value)}/>
                                                <InputError message={errors.name_eng} className="mt-2"/>
                                            </div>
                                        </AccordionBody>
                                    </Accordion>
                                    <Accordion open={open2} icon={<Icon id={2} open={open2}/>}>
                                        <AccordionHeader onClick={() => handleOpen2()}>Užsakymo
                                            informacija</AccordionHeader>
                                        <AccordionBody>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_provider">
                                                    {__("Provider")}
                                                </InputLabel>
                                                <TextInput
                                                    id="inventoryItems_provider"
                                                    type="text"
                                                    name="provider"
                                                    value={data.provider}
                                                    className="mt-1 block w-full"
                                                    onChange={e => setData('provider', e.target.value)}
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_product_code">
                                                    {__("Product code")}
                                                </InputLabel>
                                                <TextInput
                                                    id="inventoryItems_product_code"
                                                    type="text"
                                                    name="product_code"
                                                    value={data.product_code}
                                                    className="mt-1 block w-full"
                                                    onChange={e => setData('product_code', e.target.value)}
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_barcode">
                                                    {__("Barcode")}
                                                </InputLabel>
                                                <TextInput
                                                    id="inventoryItems_barcode"
                                                    type="text"
                                                    name="barcode"
                                                    value={data.barcode}
                                                    className="mt-1 block w-full"
                                                    onChange={e => setData('barcode', e.target.value)}
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_provider_url"
                                                    value={__("Provider url")}
                                                />
                                                <TextInput
                                                    id="inventoryItems_provider_url"
                                                    type="text"
                                                    name="provider_url"
                                                    value={data.provider_url}
                                                    className="mt-1 block w-full"
                                                    onChange={e => setData('provider_url', e.target.value)}
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_alt_url_to_provider">
                                                    {__("Alt url to provider")}
                                                </InputLabel>
                                                <TextInput
                                                    id="inventoryItems_alt_url_to_provider"
                                                    type="text"
                                                    name="alt_url_to_provider"
                                                    value={data.alt_url_to_provider}
                                                    className="mt-1 block w-full"
                                                    onChange={e => setData('alt_url_to_provider', e.target.value)}
                                                />
                                            </div>
                                        </AccordionBody>
                                    </Accordion>
                                    <Accordion open={open3} icon={<Icon id={3} open={open3}/>}>
                                        <AccordionHeader onClick={() => handleOpen3()}>Kiekis</AccordionHeader>
                                        <AccordionBody>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_total_count">
                                                    {__("Count")} <span className="text-red-500">*</span>
                                                </InputLabel>
                                                <TextInput
                                                    id="inventoryItems_total_count"
                                                    type="text"
                                                    name="total_count"
                                                    value={data.total_count}
                                                    className="mt-1 block w-full"
                                                    onChange={e => setData('total_count', e.target.value)}
                                                />
                                                <InputError message={errors.total_count} className="mt-2"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_critical_amount">
                                                    {__("Critical amount")} <span className="text-red-500">*</span>
                                                </InputLabel>
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
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_multiple_locations">
                                                    {__("Multiple locations")} <span className="text-red-500">*</span>
                                                </InputLabel>
                                                <Checkbox id="inventoryItems_multiple_locations" className="ml-1 p-2 block w-8 h-8" onClick={handleCheckbox}/>
                                                <InputError message={errors.multiple_locations} className="mt-2"/>
                                            </div>
                                        </AccordionBody>
                                    </Accordion>
                                    <Accordion open={open4} icon={<Icon id={4} open={open4}/>}>
                                        <AccordionHeader onClick={() => handleOpen4()}>Vieta</AccordionHeader>
                                        <AccordionBody>
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_local_laboratory"
                                                    value={__("Laboratory")}
                                                />
                                                <TextInput
                                                    id="inventoryItems_local_laboratory"
                                                    type="text"
                                                    name="laboratory"
                                                    value={data.laboratory}
                                                    className="mt-1 block w-full"
                                                    onChange={e => setData('laboratory', e.target.value)}
                                                />
                                                <InputError message={errors.laboratory} className="mt-2"/>
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
                            </form>)}
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
