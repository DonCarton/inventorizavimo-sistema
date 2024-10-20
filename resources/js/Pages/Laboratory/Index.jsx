import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, useForm} from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import {__} from "@/Libs/Lang.jsx";
import TextInput from "@/Components/TextInput.jsx";
import TableHeader from "@/Components/TableHeader.jsx";
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";
import {TbEdit} from "react-icons/tb";
import {RiDeleteBin6Line} from "react-icons/ri";
import SuccessMessage from "@/Components/SuccessMessage.jsx";
import React, {useState} from "react";
import WarningMessage from "@/Components/WarningMessage.jsx";
import FileUploadModal from "@/Components/FileUploadModal.jsx";
import GroupButtonDropdown from "@/Components/Actions/GroupButtonDropdown.jsx";
import FailureMessage from "@/Components/FailureMessage.jsx";

export default function Index({auth, laboratories, role, queryParams = null, success, warning, failure}) {
    queryParams = queryParams || {};
    const handleConfirmMessage = __("Are you sure you want to delete this item")+'?';
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
    const handleDestory = (value) => {
        if (window.confirm(handleConfirmMessage)) {
            router.delete(route('laboratories.destroy', value), {preserveScroll: true})
        }
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
            header={
                <div className="flex justify-between items-center">
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Laboratories")}</h2>
                        <InformationIconToolTip
                            content={__("Here you can view all the available laboratory locations") + '.'}
                            placement="right-end" classname="bg-black" color="black"
                            classnameForIcon="w-5 h-5 ml-1 mt-1"/>

                    </div>
                    <GroupButtonDropdown id="dropdown-actions-inventory" name="actions-inventory" nameOfDropdownButton={__("Actions")}>
                        {role.includes('admin') && <>
                            <div id="create-new-entry" title="Create a new entry in the current page."
                                 className="px-2 py-1 bg-white border-t-2 border-l-2 border-r-2 rounded-t-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                <Link href={route("laboratories.create")}>{__("Create")}</Link></div>
                            <div id="import-entries" title="Import an existing Excel sheet of data."
                                 className="px-2 py-1 bg-white border-2 border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                <a onClick={() => setModalOpen(true)}>{__("Import")}</a></div>
                            <div id="export-entries" title="Export all data from the database or export a specific set with the defined search paramters in the table."
                                 className="px-2 py-1 bg-white border-b-2 border-l-2 border-r-2 rounded-b-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                <a href={route("adminExports.laboratories", queryParams)}>{__("Export")}</a></div></>
                        }
                    </GroupButtonDropdown>
                </div>
            }
            role={role}
        >
            <Head title={__("Laboratories")}/>
            <FileUploadModal modalHeaderText={__("Import Excel of data")}
                             alertForWrongType={__("Please select a .xlsx or .csv file")}
                             alertTextForMissingFile={__("Please choose a file before uploading")}
                             submitButtonText={__("Submit")} itemNotSpecifiedText={__("Nothing chosen yet")}
                             selectFileText={__("Chosen file")} isOpen={modalOpen} onClose={closeModal}
                             onFileSelect={handleFileSelect} onSubmit={handleSubmit2}/>
            <div className="py-12">
                <div className="3xl:max-w-screen-3xl md:max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && <SuccessMessage message={success}/>}
                    {warning && <WarningMessage message={warning}/> }
                    {failure && <FailureMessage message={failure}/> }
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
                                            children={__("Name")}
                                        />
                                        <TableHeader
                                            name="updated_at"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                            children={__("Updated at")}
                                        />
                                        <th className="px-3 py-2">{__("Created by")}</th>
                                        <th className="px-3 py-2">{__("Updated by")}</th>
                                        <th className="px-3 py-2">{__("Actions")}</th>
                                    </tr>
                                    </thead>
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2">
                                            <TextInput
                                                className="w-full 3xl:text-base text-sm"
                                                defaultValue={queryParams.name}
                                                placeholder={__("Name")}
                                                onBlur={e => searchFieldChanged('name', e.target.value)}
                                                onKeyPress={e => onKeyPress('name', e)}/>
                                        </th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2">
                                            <TextInput className="w-full 3xl:text-base text-sm" placeholder={__("Updated by")}
                                                       defaultValue={queryParams.updated_by}
                                                       onBlur={e => searchFieldChanged('updated_by', e.target.value)}
                                                       onKeyPress={e => onKeyPress('updated_by', e)}/>
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
                                            <td className="px-3 py-2">{laboratory.updated_at}</td>
                                            <td className="px-3 py-2">{laboratory.created_by.email}</td>
                                            <td className="px-3 py-2">{laboratory.updated_by.email}</td>
                                            <td className="flex justify-start mt-1 px-2 py-1">
                                                <Link href={route("laboratories.edit", laboratory.id)}
                                                      className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1">
                                                    <TbEdit
                                                        className="w-8 h-8 text-emerald-500 hover:text-emerald-700 hover:animate-pulse hover:bg-gray-50"/>
                                                </Link>
                                                <a type="button"
                                                   onClick={() => handleDestory(laboratory.id)}><RiDeleteBin6Line
                                                    className="w-8 h-8 text-red-500 hover:text-red-700 hover:animate-pulse hover:bg-gray-50"/></a>
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
