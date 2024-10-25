import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import {useState} from "react";
import { useTranslation } from "@/Libs/useTranslation.jsx";
import Checkbox from "@/Components/Checkbox.jsx";
import {measureOptions, labPrefixOptions} from "@/Configurations/SelectConfigurations.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import TextInputExtra from "@/Components/Forms/TextInputExtra.jsx";
import FlexibleSelect from "@/Components/Forms/FlexibleSelect.jsx";
import AccordionWithManualIndex from "@/Components/Forms/AccordionWithManualIndex.jsx";
import FlexibleAsyncSelect from "@/Components/Forms/FlexibleAsyncSelect.jsx";

export default function Create({auth, itemTypes, queryParams, referrer}) {
    const { translate } = useTranslation();
    const [postNumber, setPostNumber] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
    const [selectedPrefix, setSelectedPrefix] = useState('BIN');
    const [selectedMeasurement, setSelectedMeasurement] = useState('');
    const {data, setData, post, processing, errors} = useForm({
        local_name: postNumber || '',
        inventory_type: '',
        name: '',
        name_eng: '',
        formula: '',
        cas_nr: '',
        user_guide: '',
        provider: '',
        product_code: '',
        barcode: '',
        url_to_provider: '',
        alt_url_to_provider: '',
        total_amount: '',
        critical_amount: '',
        to_order_amount: '',
        multiple_locations: false,
        laboratory: '',
        cupboard: '',
        shelf: '',
        storage_conditions: '',
        asset_number: '',
        used_for: '',
        comments: ''
    });
    const handlePrefixChange = async (e) => {
        const prefixId = e.target.value;
        setSelectedPrefix(prefixId);
        if (e.target.value !== '') {
            try {
                const response = await axios.post('/inventoryItems/fetch-post-number', {prefix_option_id: prefixId});
                const {post_number} = response.data;
                setPostNumber(post_number);
                setData('local_name', post_number);
            } catch (error) {
                console.error('Error fetching post number:', error.message);
            }
        }
    };
    const handleMeasureChoice = (e) => {
        const measureValue = e.target.value;
        let localName = postNumber;
        if (e.target.value !== '') {
            localName = `${localName}-${measureValue}`;
            setSelectedMeasurement(e.target.value);
            setData('local_name', localName);
            handleTabChange(2);
        } else {
            setSelectedMeasurement(measureValue);
            setData('local_name', postNumber);
        }
    }
    const handleTabChange = (tabNumber) => {
        setActiveTab(tabNumber);
    };
    const [checkbox, setCheckbox] = useState(false);
    const [assetNumberShown, setAssetNumberShown] = useState(false);
    const handleCheckbox = (e) => {
        setData('multiple_locations', e.target.checked);
        setCheckbox(e.target.checked);
    }
    const handleLaboratoryChoice = (e) => {
        setData('laboratory', e);
    }
    const handleCupboardChange = (e) => {
        setData('cupboard', e);
    }
    const handleShelfChange = (e) => {
        setData('shelf', e);
    }
    const handleInventoryTypeChange = (e) => {
        if (e !== null){
            if (itemTypes.data[e-1].assetRequired === false){ setAssetNumberShown(true); setData('asset_number_required', true) } else {setAssetNumberShown(false); setData('asset_number_required', false)}
        } else {
            setAssetNumberShown(false);
        }
        setData('inventory_type', e);
    }
    const onSubmit = (e) => {
        e.preventDefault();

        post(route('inventoryItems.store', {referrer: referrer, query: queryParams}));
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{translate("Create new inventory item")}</h2>
                </div>
            }
        >
            <Head title={translate("Create new inventory item")}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {activeTab === 1 && (
                            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <InputLabel htmlFor="inventoryItems_unit">
                                        {translate("Choose where the item will be stored")}<span
                                        className="text-red-500">*</span>
                                    </InputLabel>
                                    <select
                                        className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                                        value={selectedPrefix}
                                        onChange={handlePrefixChange}>
                                        <option value="">{translate("Choose a value")}</option>
                                        {labPrefixOptions.map((prefixOption) => (
                                            <option key={prefixOption.value}
                                                    value={prefixOption.value}>{prefixOption.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel htmlFor="inventoryItems_unit">
                                        {translate("Storage measurement")}<span className="text-red-500">*</span>
                                    </InputLabel>
                                    <select id="inventoryItems_unit" disabled={!postNumber}
                                            className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block disabled:bg-gray-400 disabled:text-white w-full"
                                            value={selectedMeasurement}
                                            onChange={handleMeasureChoice}>
                                        <option id="0" value="">{translate("Choose a value")}</option>
                                        {measureOptions.map(option => (
                                            <option key={option.value} value={option.value}>{translate(option.label)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Link href={route(`inventoryItems.${referrer ? referrer : 'index'}`, queryParams)}
                                          className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        {translate("Cancel")}
                                    </Link>
                                </div>
                            </div>
                        )}
                        {activeTab === 2 && (
                            <form onSubmit={onSubmit}
                                  className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                                <div className="pb-6">
                                    <AccordionWithManualIndex expandedByDefault={true} indexOfAcc={1}
                                                              headerName={translate("Inventory information")}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="inventoryItems_local_name">
                                                    {translate("Local name")}<span className="text-red-500">*</span>
                                                </InputLabel>
                                                <TextInput id="inventoryItems_local_name" type="text"
                                                           name="local_name"
                                                           value={data.local_name}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"
                                                           disabled={true} readOnly={true}/>
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="inventoryItems_itemType" className="mb-1">
                                                    {translate("Type")} <span className="text-red-500">*</span>
                                                </InputLabel>
                                                <FlexibleSelect id="inventoryItems_itemType" name="itemType"
                                                                customPlaceHolder={translate("Choose an inventory type")}
                                                                value={data.inventory_type}
                                                                onChange={handleInventoryTypeChange}
                                                                fetchUrlPath="/select/itemTypes"
                                                                customNoOptionsMessage={translate("No item types found")}
                                                                customLoadingMessage={translate("Fetching options") + "..."}
                                                                customIsMulti={false}
                                                />
                                                <InputError message={errors.inventory_type} className="mt-2"/>
                                            </div>
                                            <div className="mt-1 w-full">
                                                <InputLabel htmlFor="inventoryItems_asset_number">
                                                    {translate("Asset number")} {assetNumberShown && <span className="text-red-500">*</span>}
                                                </InputLabel>
                                                <TextInputExtra id="inventoryItems_asset_number" name="asset_number"
                                                                className={assetNumberShown ? "w-full" : "w-full bg-gray-400 text-white"}
                                                                type="text" disabled={!assetNumberShown} readOnly={!assetNumberShown}
                                                                onChange={e => setData('asset_number', e.target.value)}>
                                                </TextInputExtra>
                                                <InputError message={errors.asset_number} className="mt-2"/>
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="inventoryItems_name">
                                                    {translate("Name")} <span className="text-red-500">*</span>
                                                </InputLabel>
                                                <TextInput id="inventoryItems_name" type="text" name="name"
                                                           value={data.name} className="mt-1 block w-full"
                                                           onChange={e => setData('name', e.target.value)}/>
                                                <InputError message={errors.name} className="mt-2"/>
                                            </div>
                                            <div>
                                                {/*TODO MONITOR THIS PART AS APPARENTLY REACT COMPLAINS WHEN THE SCENE CHANGES*/}
                                                <InputLabel htmlFor="inventoryItems_name_eng">
                                                    {translate("Name ENG")} <span className="text-red-500">*</span>
                                                </InputLabel>
                                                <TextInput id="inventoryItems_name_eng" type="text" name="name_eng"
                                                           value={data.name_eng} className="mt-1 block w-full"
                                                           onChange={e => setData('name_eng', e.target.value)}/>
                                                <InputError message={errors.name_eng} className="mt-2"/>
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="inventoryItems_formula">
                                                    {translate("Formula")}
                                                </InputLabel>
                                                <TextInput id="inventoryItems_formula" type="text" name="name_eng"
                                                           value={data.formula} className="mt-1 block w-full"
                                                           onChange={e => setData('formula', e.target.value)}/>
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="inventoryItems_cas_nr">
                                                    {translate("CAS NR")}
                                                </InputLabel>
                                                <TextInput id="inventoryItems_cas_nr" type="text" name="name_eng"
                                                           value={data.cas_nr} className="mt-1 block w-full"
                                                           onChange={e => setData('cas_nr', e.target.value)}/>
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="inventoryItems_user_guide">
                                                    {translate("User guide")}
                                                </InputLabel>
                                                <TextInput id="inventoryItems_user_guide" type="text"
                                                           name="user_guide"
                                                           value={data.user_guide} className="mt-1 block w-full"
                                                           onChange={e => setData('user_guide', e.target.value)}/>
                                            </div>
                                        </div>
                                    </AccordionWithManualIndex>
                                    <AccordionWithManualIndex expandedByDefault={true} indexOfAcc={2}
                                                              headerName={translate("Order information")}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="inventoryItems_provider">
                                                    {translate("Provider")}
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
                                            <div>
                                                <InputLabel htmlFor="inventoryItems_product_code">
                                                    {translate("Product code")}
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
                                            <div>
                                                <InputLabel htmlFor="inventoryItems_barcode">
                                                    {translate("Barcode")}
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
                                            <div>
                                                <InputLabel
                                                    htmlFor="inventoryItems_url_to_provider"
                                                    value={translate("Provider url")}
                                                />
                                                <TextInput
                                                    id="inventoryItems_url_to_provider"
                                                    type="url"
                                                    title={translate("Must be a url")}
                                                    name="url_to_provider"
                                                    pattern="https?://.+"
                                                    value={data.url_to_provider}
                                                    className="mt-1 block w-full"
                                                    onChange={e => setData('url_to_provider', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="inventoryItems_alt_url_to_provider">
                                                    {translate("Alt url to provider")}
                                                </InputLabel>
                                                <TextInput
                                                    id="inventoryItems_alt_url_to_provider"
                                                    type="url"
                                                    title={translate("Must be a url")}
                                                    name="alt_url_to_provider"
                                                    pattern="https?://.+"
                                                    value={data.alt_url_to_provider}
                                                    className="mt-1 block w-full"
                                                    onChange={e => setData('alt_url_to_provider', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </AccordionWithManualIndex>
                                    <AccordionWithManualIndex expandedByDefault={true} indexOfAcc={3}
                                                              headerName={translate("Amount")}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="inventoryItems_total_amount">
                                                    {translate("Count")} <span className="text-red-500">*</span>
                                                </InputLabel>
                                                <TextInput
                                                    id="inventoryItems_total_amount"
                                                    type="text"
                                                    name="total_amount"
                                                    value={data.total_amount}
                                                    className="mt-1 block w-full"
                                                    onChange={e => setData('total_amount', e.target.value)}
                                                />
                                                <InputError message={errors.total_amount} className="mt-2"/>
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="inventoryItems_critical_amount">
                                                    {translate("Critical amount")} <span className="text-red-500">*</span>
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
                                            <div>
                                                <InputLabel htmlFor="inventoryItems_multiple_locations">
                                                    {translate("Multiple locations")} <span
                                                    className="text-red-500">*</span>
                                                </InputLabel>
                                                <Checkbox id="inventoryItems_multiple_locations"
                                                          className="ml-1 p-2 block w-6 h-6"
                                                          checked={checkbox}
                                                          onChange={handleCheckbox}/>
                                                <InputError message={errors.multiple_locations} className="mt-2"/>
                                            </div>
                                        </div>
                                    </AccordionWithManualIndex>
                                    <AccordionWithManualIndex expandedByDefault={true} indexOfAcc={4}
                                                              headerName={translate("Location")}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="inventoryItems_local_laboratory">{translate("Location")}<span
                                                    className="text-red-500">*</span></InputLabel>
                                                <FlexibleSelect id="inventoryItems_local_laboratory"
                                                                name="local_laboratory"
                                                                customPlaceHolder={translate("Choose a laboratory")}
                                                                value={data.laboratory}
                                                                onChange={handleLaboratoryChoice}
                                                                fetchUrlPath="/select/laboratories"
                                                                customNoOptionsMessage={translate("No laboratories found")}
                                                                customLoadingMessage={translate("Fetching options") + "..."}
                                                                customIsMulti={false}
                                                />
                                                <InputError message={errors.laboratory} className="mt-2"/>
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="inventoryItems_local_cupboard">{translate("Cupboard")}<span
                                                    className="text-red-500">*</span></InputLabel>
                                                <FlexibleAsyncSelect id="inventoryItems_local_cupboard"
                                                                     name="local_cupboard"
                                                                     fetchUrlPath="/select/cupboards"
                                                                     customIsMulti={false}  customLoadingMessage={translate("Fetching options") + "..."} customPlaceHolder={translate("Choose a cupboard")} customNoOptionsMessage={translate("No inventory item found")}
                                                                     value={data.cupboard}
                                                                     onChange={handleCupboardChange}
                                                />
                                                <InputError message={errors.cupboard} className="mt-2"/>
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="inventoryItems_local_shelf">{translate("Shelf")}<span
                                                    className="text-red-500">*</span></InputLabel>
                                                <FlexibleAsyncSelect id="inventoryItems_local_shelf"
                                                                     name="local_shelf"
                                                                     fetchUrlPath="/select/shelves"
                                                                     customIsMulti={false} customLoadingMessage={translate("Fetching options") + "..."} customPlaceHolder={translate("Choose a shelf")} customNoOptionsMessage={translate("No inventory item found")}
                                                                     value={data.shelf}
                                                                     onChange={handleShelfChange}
                                                />
                                                <InputError message={errors.shelf} className="mt-2"/>
                                            </div>
                                        </div>
                                    </AccordionWithManualIndex>
                                    <AccordionWithManualIndex expandedByDefault={true} indexOfAcc={5}
                                                              headerName={translate("Additional information")}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="inventoryItems_storage_conditions">{translate("Storage conditions")}</InputLabel>
                                                <TextInputExtra id="inventoryItems_storage_conditions"
                                                                className="w-full"
                                                                name="storage_conditions" type="textarea"
                                                                onChange={e => setData('storage_conditions', e.target.value)}></TextInputExtra>
                                                <InputError message={errors.storage_conditions} className="mt-2"/>
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="inventoryItems_used_for">{translate("Used for")}</InputLabel>
                                                <TextInputExtra id="inventoryItems_used_for" name="used_for"
                                                                className="w-full"
                                                                type="textarea"
                                                                onChange={e => setData('used_for', e.target.value)}></TextInputExtra>
                                                <InputError message={errors.used_for} className="mt-2"/>
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="inventoryItems_comments">{translate("Comments")}</InputLabel>
                                                <TextInputExtra id="inventoryItems_comments" name="comments"
                                                                className="w-full"
                                                                type="textarea"
                                                                onChange={e => setData('comments', e.target.value)}></TextInputExtra>
                                                <InputError message={errors.comments} className="mt-2"/>
                                            </div>
                                        </div>
                                    </AccordionWithManualIndex>
                                </div>
                                <div>
                                    <Link href={route(`inventoryItems.${referrer ? referrer : 'index'}`, queryParams)}
                                          className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        {translate("Cancel")}
                                    </Link>
                                    <PrimaryButton className="ml-2" disabled={processing}>{translate("Create")}</PrimaryButton>
                                </div>
                            </form>)}
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
