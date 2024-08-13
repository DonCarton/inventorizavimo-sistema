import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm, router} from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import React, {useState} from "react";
import StringHelper from '@/Libs/StringHelper';
import TextInput from "@/Components/TextInput.jsx";
import TableHeader from "@/Components/TableHeader.jsx";
import {TbEdit, TbArrowsUpDown} from "react-icons/tb";
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";
import FileUploadModal from "@/Components/FileUploadModal.jsx";
import FailureMessage from "@/Components/FailureMessage.jsx";
import SuccessMessage from "@/Components/SuccessMessage.jsx";
import DownloadButton from "@/Components/Actions/DownloadButton.jsx";
import GroupButtonDropdown from "@/Components/Actions/GroupButtonDropdown.jsx";
import SteamDropdown from '@/Components/SteamDropdown';

export default function Index({auth, inventoryItems, itemTypes, role, queryParams = null, success, failure}) {
    queryParams = queryParams || {};
    const [modalOpen, setModalOpen] = useState(false);
    const {setData, post} = useForm({
        title: '',
        file: null,
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
    const handleFileSelect = (file) => {
        setData('file', file);
    };
    function handleSubmit() {
        post(route("importInventoryItems"));
        setModalOpen(false);
        setData("title", "");
        setData("file", null);
    }
    function closeModal() {
        setModalOpen(false);
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Inventory")}</h2>
                        <InformationIconToolTip
                            content={StringHelper.__("Here you can view all the available inventory items") + '.'}
                            placement="right-end" classname="bg-black" color="black"
                            classnameForIcon="w-5 h-5 ml-1 mt-1"/>
                    </div>
                    <GroupButtonDropdown id="dropdown-actions-inventory" name="actions-inventory" nameOfDropdownButton={StringHelper.__("Actions")}>
                        {role === 'admin' ? <>
                            <div id="create-new-entry" title="Create a new entry in the current page."
                                 className="px-2 py-1 bg-white border-t-2 border-l-2 border-r-2 rounded-t-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                <a href={route("inventoryItems.create")}>{StringHelper.__("Create")}</a></div>
                            <div id="import-entries" title="Import an existing Excel sheet of data."
                                 className="px-2 py-1 bg-white border-2 border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                <a onClick={() => setModalOpen(true)}>{StringHelper.__("Import")}</a></div>
                            <div id="export-entries" title="Export all data from the database or export a specific set with the defined search parameters in the table."
                                className="px-2 py-1 bg-white border-b-2 border-l-2 border-r-2 rounded-b-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                <a href={route("exports.inventoryItems", queryParams)}>{StringHelper.__("Export")}</a></div></> :
                            <DownloadButton linkToItem={route("exports.inventoryItems", queryParams)}>{StringHelper.__("Export")}</DownloadButton>
                        }
                    </GroupButtonDropdown>
                </div>
            }
            role={role}
        >
            <Head title={StringHelper.__("Inventory")}/>
            <FileUploadModal modalHeaderText={StringHelper.__("Import Excel of data")}
                             alertForWrongType={StringHelper.__("Please select a .xlsx or .csv file")}
                             alertTextForMissingFile={StringHelper.__("Please choose a file before uploading")}
                             submitButtonText={StringHelper.__("Submit")} itemNotSpecifiedText={StringHelper.__("Nothing chosen yet")}
                             selectFileText={StringHelper.__("Chosen file")} isOpen={modalOpen} onClose={closeModal}
                             onFileSelect={handleFileSelect} onSubmit={handleSubmit}/>
            <div className="py-12">
                <div className="3xl:max-w-screen-3xl md:max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && <SuccessMessage message={success}/>}
                    {failure && <FailureMessage message={failure}/>}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table
                                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
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
                                        {/*<th className="px-3 py-2">{StringHelper.__("Updated by")}</th>*/}
                                        <th className="px-3 py-2">{StringHelper.__("Actions")}</th>
                                    </tr>
                                    </thead>
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2">
                                            <TextInput
                                                className="w-full text-sm"
                                                defaultValue={queryParams.local_name}
                                                placeholder={StringHelper.__("Item search")}
                                                onKeyPress={e => onKeyPress('local_name', e)}
                                            />
                                        </th>
                                        <th className="px-3 py-2">
                                            <TextInput
                                                className="w-full text-sm"
                                                defaultValue={queryParams.name}
                                                placeholder={StringHelper.__("Name")}
                                                onKeyPress={e => onKeyPress('name', e)}/>
                                        </th>
                                        <th className="px-3 py-2">
                                            <TextInput
                                                className="w-full text-sm"
                                                defaultValue={queryParams.name_eng}
                                                placeholder={StringHelper.__("Name ENG")}
                                                onKeyPress={e => onKeyPress('name_eng', e)}/>
                                        </th>
                                        <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2">
                                                <SteamDropdown name="inventory_type_query_select" className="w-full text-sm text-gray-500" value={queryParams.inventory_type} options={itemTypes.data} onChange={e => onSelectChange('inventory_type', e)} />
                                        </th>
                                        <th className="px-3 py-2">
                                            <TextInput
                                                className="w-full text-sm"
                                                defaultValue={queryParams.laboratory}
                                                placeholder={StringHelper.__("Laboratory")}
                                                onKeyPress={e => onKeyPress('laboratory', e)}/>
                                        </th>
                                        <th className="px-3 py-2">
                                            <TextInput className="w-full text-sm" placeholder={StringHelper.__("Updated by")}
                                                       defaultValue={queryParams.updated_by}
                                                       onBlur={e => searchFieldChanged('updated_by', e.target.value)}
                                                       onKeyPress={e => onKeyPress('updated_by', e)}/>
                                        </th>
                                        <th className="px-3 py-2"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {inventoryItems.data.map(inventoryItem => (
                                        <tr key={inventoryItem.id}
                                            className={`border-b sm:text-base ${inventoryItem.inventoryStatus === "critical" ? `bg-red-300 dark:bg-red-300 dark:border-red-700` : inventoryItem.inventoryStatus === "taken" ? `bg-yellow-300 dark:bg-yellow-300 dark:border-yellow-200` : `bg-white dark:bg-gray-800 dark:border-gray-700`}`}>
                                            <td className="px-3 py-2">
                                                <Link href={route("inventoryItems.show", {inventoryItem: inventoryItem.id, query: queryParams})}
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
                                            <td className="flex justify-start mt-1 px-2 py-1">
                                                <Link href={route("inventoryItems.editRaw", {inventoryItem: inventoryItem.id, query: queryParams})} title={StringHelper.__("Edit")+'.'}
                                                      className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1">
                                                    <TbEdit
                                                        className="w-8 h-8 text-emerald-500 hover:text-emerald-700 hover:animate-pulse hover:bg-gray-50"/>
                                                </Link>
                                                <Link href={route("inventoryItems.edit", {inventoryItem: inventoryItem.id, query: queryParams})} title={StringHelper.__("Edit amount")+'.'}
                                                      className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1">
                                                    <TbArrowsUpDown
                                                        className="w-8 h-8 text-emerald-500 hover:text-emerald-700 hover:animate-pulse hover:bg-gray-50"/>
                                                </Link>
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
