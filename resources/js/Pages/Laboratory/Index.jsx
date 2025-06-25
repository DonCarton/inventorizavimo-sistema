import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import TextInput from "@/Components/TextInput.jsx";
import TableHeader from "@/Components/TableHeader.jsx";
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";
// import { TbEdit } from "react-icons/tb";
import SuccessMessage from "@/Components/SuccessMessage.jsx";
import React, { useState } from "react";
import WarningMessage from "@/Components/WarningMessage.jsx";
import FileUploadModal from "@/Components/FileUploadModal.jsx";
import GroupButtonDropdown from "@/Components/Actions/GroupButtonDropdown.jsx";
import FailureMessage from "@/Components/FailureMessage.jsx";
import BulkActionsButton from '@/Components/Actions/BulkActionsButton';
import EditButton from '@/Components/Forms/EditButton';

export default function Index({ auth, laboratories, queryParams = null, success, warning, failure }) {
    queryParams = queryParams || {};
    const [modalOpen, setModalOpen] = useState(false);
    const { setData, post } = useForm({
        title: '',
        file: null,
    });
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('laboratories.index'), queryParams);
    }
    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;
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
        router.get(route('laboratories.index'), queryParams);
    }
    const handleFileSelect = (file) => {
        setData('file', file);
    };
    function handleSubmit2() {
        post(route("adminImports.laboratories"));
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
            can={auth.can}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Laboratories")}</h2>
                        <InformationIconToolTip
                            content={StringHelper.__("Here you can view all the available laboratory locations") + '.'}
                            placement="right-end" classname="bg-black" color="black"
                            classnameForIcon="w-5 h-5 ml-1 mt-1" />

                    </div>
                    <GroupButtonDropdown id="dropdown-actions-inventory" name="actions-inventory" nameOfDropdownButton={StringHelper.__("Actions")}>
                        {auth.can.create.laboratory && <>
                            <button type="button" id="create-new-entry" title="Create a new entry in the current page."
                                className="px-2 py-1 bg-white border-t-2 border-l-2 border-r-2 rounded-t-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                <Link href={route("laboratories.create")}>{StringHelper.__("Create")}</Link></button>
                            <Link href={route("import-definitions.index")}>
                                <button type="button" id="import-entries" title="Import an existing Excel sheet of data."
                                    className="px-2 py-1 bg-white border-2 border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                    {StringHelper.__("Import")}
                                </button>
                            </Link>
                            <button type="button" id="export-entries" title="Export all data from the database or export a specific set with the defined search paramters in the table."
                                className="px-2 py-1 bg-white border-b-2 border-l-2 border-r-2 rounded-b-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                <a href={route("adminExports.laboratories", queryParams)}>{StringHelper.__("Export")}</a></button></>
                        }
                    </GroupButtonDropdown>
                </div>
            }
        >
            <Head title={StringHelper.__("Laboratories")} />
            <FileUploadModal modalHeaderText={StringHelper.__("Import Excel of data")}
                alertForWrongType={StringHelper.__("Please select a .xlsx or .csv file")}
                alertTextForMissingFile={StringHelper.__("Please choose a file before uploading")}
                submitButtonText={StringHelper.__("Submit")} itemNotSpecifiedText={StringHelper.__("Nothing chosen yet")}
                selectFileText={StringHelper.__("Chosen file")} isOpen={modalOpen} onClose={closeModal}
                onFileSelect={handleFileSelect} onSubmit={handleSubmit2} />
            <div className="py-12">
                <div className="3xl:max-w-screen-3xl md:max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && <SuccessMessage message={success} />}
                    {warning && <WarningMessage message={warning} />}
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
                                                name="name"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                                children={StringHelper.__("Name")}
                                            />
                                            <TableHeader
                                                name="ident_code"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                                children={StringHelper.__("Identification code")}
                                            />
                                            <TableHeader
                                                name="updated_at"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                                children={StringHelper.__("Updated at")}
                                            />
                                            <th className="px-3 py-2">{StringHelper.__("Created by")}</th>
                                            <th className="px-3 py-2">{StringHelper.__("Updated by")}</th>
                                            <th className="px-3 py-2">{StringHelper.__("Actions")}</th>
                                        </tr>
                                    </thead>
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-2">
                                                <TextInput
                                                    className="w-full 3xl:text-base text-sm"
                                                    defaultValue={queryParams.name}
                                                    placeholder={StringHelper.__("Name")}
                                                    onBlur={e => searchFieldChanged('name', e.target.value)}
                                                    onKeyPress={e => onKeyPress('name', e)} />
                                            </th>
                                            <th className="px-3 py-2">
                                                <TextInput
                                                    className="w-full 3xl:text-base text-sm"
                                                    defaultValue={queryParams.ident_code}
                                                    placeholder={StringHelper.__("Identification code")}
                                                    onBlur={e => searchFieldChanged('ident_code', e.target.value)}
                                                    onKeyPress={e => onKeyPress('ident_code', e)} />
                                            </th>
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2"></th>
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
                                        {laboratories.data.map(laboratory => (
                                            <tr key={laboratory.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 sm:text-base">
                                                <td className="px-3 py-2"><Link
                                                    href={route("laboratories.show", laboratory.id)}
                                                    className="text-black dark:text-green-400 hover:underline mx-1"
                                                >{laboratory.name}
                                                </Link>
                                                </td>
                                                <td className="px-3 py-2">{laboratory.ident_code}</td>
                                                <td className="px-3 py-2">{laboratory.updated_at}</td>
                                                <td className="px-3 py-2">{laboratory.created_by.email}</td>
                                                <td className="px-3 py-2">{laboratory.updated_by.email}</td>
                                                <td className="flex justify-start mt-1 mb-1 px-2 py-1">
                                                    <BulkActionsButton>
                                                        <EditButton title={StringHelper.__("Edit")} href={route("laboratories.edit", laboratory.id)}>{StringHelper.__("Edit")}</EditButton>
                                                    </BulkActionsButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={laboratories.meta.links}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
