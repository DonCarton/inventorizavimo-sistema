import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import React, { useState } from "react";
import StringHelper from '@/Libs/StringHelper';
import TextInput from "@/Components/TextInput.jsx";
import TableHeader from "@/Components/TableHeader.jsx";
import { TbEdit, TbArrowsUpDown } from "react-icons/tb";
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";
import FileUploadModal from "@/Components/FileUploadModal.jsx";
import FailureMessage from "@/Components/FailureMessage.jsx";
import SuccessMessage from "@/Components/SuccessMessage.jsx";
import DownloadButton from "@/Components/Actions/DownloadButton.jsx";
import GroupButtonDropdown from "@/Components/Actions/GroupButtonDropdown.jsx";
import SteamDropdown from '@/Components/SteamDropdown';
import BulkActionsButton from '@/Components/Actions/BulkActionsButton';
import MiscButton from '@/Components/Forms/MiscButton';

export default function Index({ auth, inventoryItems, itemTypes, queryParams = null, success, failure }) {
    queryParams = queryParams || {};
    const [modalOpen, setModalOpen] = useState(false);
    const { setData, post } = useForm({
        title: '',
        file: null,
        failsViaMail: false,
    });
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('inventoryItems.index'), queryParams);
    };
    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;
        searchFieldChanged(name, e.target.value);
    };
    const onSelectChange = (name, e) => {
        searchFieldChanged(name, e.target.value);
    }
    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === 'asc') {
                queryParams.sort_direction = 'desc';
            } else {
                queryParams.sort_direction = 'asc';
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route('inventoryItems.index'), queryParams);
    };
    const handleCheckbox = (e) => {
        setData('failsViaMail', e.target.checked);
    };
    const handleFileSelect = (file) => {
        setData('file', file);
    };
    function handleSubmit() {
        post(route("adminImports.inventoryItems"));
        setModalOpen(false);
        setData("title", "");
        setData("file", null);
        setData("failsViaMail", false);
    }
    function closeModal() {
        setModalOpen(false);
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Inventory")}</h2>
                        <InformationIconToolTip
                            content={StringHelper.__("Here you can view all the available inventory items") + '.'}
                            placement="right-end" classname="bg-black" color="black"
                            classnameForIcon="w-5 h-5 ml-1 mt-1" />
                    </div>
                    <GroupButtonDropdown id="dropdown-actions-inventory" name="actions-inventory" nameOfDropdownButton={StringHelper.__("Actions")}>
                        {auth.can.create.inventoryItem ? <>
                            <Link href={route("inventoryItems.create", { query: queryParams })}><button type="button" id="create-new-entry" title="Create a new entry in the current page."
                                className="px-2 py-1 bg-white border-t-2 border-l-2 border-r-2 rounded-t-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">

                                {StringHelper.__("Create")}
                            </button>
                            </Link>
                            <Link href={route("import-definitions.index")}>
                                <button type="button" id="import-entries" title="Import an existing Excel sheet of data."
                                    className="px-2 py-1 bg-white border-2 border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                        <Link href={route("import-definitions.index")}>{StringHelper.__("Import")}</Link>
                                </button>
                            </Link>
                            <a href={route("exports.inventoryItems", queryParams)}>
                                <button type="button" id="export-entries" title="Export all data from the database or export a specific set with the defined search parameters in the table."
                                    className="px-2 py-1 bg-white border-b-2 border-l-2 border-r-2 rounded-b-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                    {StringHelper.__("Export")}
                                </button>
                            </a></> :
                            <DownloadButton linkToItem={route("exports.inventoryItems", queryParams)}>{StringHelper.__("Export")}</DownloadButton>
                        }
                    </GroupButtonDropdown>
                </div>
            }
        >
            <Head title={StringHelper.__("Inventory")} />
            <FileUploadModal modalHeaderText={StringHelper.__("Import Excel of data")}
                alertForWrongType={StringHelper.__("Please select a .xlsx or .csv file")}
                alertTextForMissingFile={StringHelper.__("Please choose a file before uploading")}
                submitButtonText={StringHelper.__("Submit")} itemNotSpecifiedText={StringHelper.__("Nothing chosen yet")}
                selectFileText={StringHelper.__("Chosen file")} checkboxText={StringHelper.__("Receive results via mail")} isOpen={modalOpen} onClose={closeModal}
                onFileSelect={handleFileSelect} onFailsViaMailCheck={handleCheckbox} onSubmit={handleSubmit} />
            <div className="py-12">
                <div className="3xl:max-w-screen-4xl md:max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && <SuccessMessage message={success} />}
                    {failure && <FailureMessage message={failure} />}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table
                                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead
                                        className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <TableHeader
                                                name="local_name"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                                children={StringHelper.__("Local name")}
                                            />
                                            <TableHeader
                                                name="name"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                                children={StringHelper.__("Name")}
                                            />
                                            <TableHeader
                                                name="name_eng"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                                children={StringHelper.__("Name ENG")}
                                            />
                                            <th className="px-3 py-2">{StringHelper.__("Count")}</th>
                                            <TableHeader
                                                name="inventory_type"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                                children={StringHelper.__("Type")}
                                            />
                                            <TableHeader
                                                name="laboratory"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                                children={StringHelper.__("Laboratory")}
                                            />
                                            <TableHeader
                                                name="updated_by"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                                children={StringHelper.__("Updated by")}
                                            />
                                            <th className="px-3 py-2">{StringHelper.__("Actions")}</th>
                                        </tr>
                                    </thead>
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-2">
                                                <TextInput
                                                    className="w-full 3xl:text-base text-sm"
                                                    defaultValue={queryParams.local_name}
                                                    placeholder={StringHelper.__("Item search")}
                                                    onKeyPress={e => onKeyPress('local_name', e)}
                                                />
                                            </th>
                                            <th className="px-3 py-2">
                                                <TextInput
                                                    className="w-full 3xl:text-base text-sm"
                                                    defaultValue={queryParams.name}
                                                    placeholder={StringHelper.__("Name")}
                                                    onKeyPress={e => onKeyPress('name', e)} />
                                            </th>
                                            <th className="px-3 py-2">
                                                <TextInput
                                                    className="w-full 3xl:text-base text-sm"
                                                    defaultValue={queryParams.name_eng}
                                                    placeholder={StringHelper.__("Name ENG")}
                                                    onKeyPress={e => onKeyPress('name_eng', e)} />
                                            </th>
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2">
                                                <SteamDropdown name="inventory_type_query_select" className="w-full 3xl:text-base text-sm text-gray-500" value={queryParams.inventory_type} options={itemTypes.data} onChange={e => onSelectChange('inventory_type', e)} />
                                            </th>
                                            <th className="px-3 py-2">
                                                <TextInput
                                                    className="w-full 3xl:text-base text-sm"
                                                    defaultValue={queryParams.laboratory}
                                                    placeholder={StringHelper.__("Laboratory")}
                                                    onKeyPress={e => onKeyPress('laboratory', e)} />
                                            </th>
                                            <th className="px-3 py-2">
                                                <TextInput className="w-full 3xl:text-base text-sm" placeholder={StringHelper.__("Updated by")}
                                                    defaultValue={queryParams.updated_by}
                                                    onBlur={e => searchFieldChanged('updated_by', e.target.value)}
                                                    onKeyPress={e => onKeyPress('updated_by', e)} />
                                            </th>
                                            <th className="px-3 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventoryItems.data.map(inventoryItem => (
                                            <tr key={inventoryItem.id}
                                                className={`border-b sm:text-base ${inventoryItem.inventoryStatus === "critical" ? `bg-red-300 dark:bg-red-300 dark:border-red-700` : inventoryItem.inventoryStatus === "taken" ? `bg-yellow-300 dark:bg-yellow-300 dark:border-yellow-200` : `bg-white dark:bg-gray-800 dark:border-gray-700`}`}>
                                                <td className="px-3 py-2">
                                                    <Link href={route("inventoryItems.show", { inventoryItem: inventoryItem.id, query: queryParams })}
                                                        className="font-medium text-gray-700 dark:text-white hover:underline mx-1">
                                                        {inventoryItem.localName}
                                                    </Link>
                                                </td>
                                                <td className="px-3 py-2">{inventoryItem.name}</td>
                                                <td className="px-3 py-2">{inventoryItem.nameEng}</td>
                                                <td className="px-3 py-2">{inventoryItem.totalAmount}</td>
                                                <td className="px-3 py-2">{inventoryItem.inventoryType}</td>
                                                <td className="px-3 py-2">{inventoryItem.laboratory}</td>
                                                <td className="px-3 py-2">{inventoryItem.updatedBy}</td>
                                                <td className="flex justify-start mt-1 mb-1 px-2 py-1">
                                                    <BulkActionsButton>
                                                        {inventoryItem.can.edit && <MiscButton classVariant="green" title={StringHelper.__("Edit")} as="link" to={route("inventoryItems.editRaw", { inventoryItem: inventoryItem.id, query: queryParams })} icon={TbEdit} children={StringHelper.__("Edit")}/>}
                                                        <MiscButton classVariant="green" title={StringHelper.__("Edit amount")} as="link" to={route("inventoryItems.edit", { inventoryItem: inventoryItem.id, query: queryParams })} icon={TbArrowsUpDown} children={StringHelper.__("Change amount")} />
                                                    </BulkActionsButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={inventoryItems.meta.links}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
