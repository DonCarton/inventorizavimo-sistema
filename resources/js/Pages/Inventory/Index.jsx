import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm, router} from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import React, {useRef, useState} from "react";
import {__} from "@/Libs/Lang.jsx";
import TextInput from "@/Components/TextInput.jsx";
import TableHeader from "@/Components/TableHeader.jsx";
import {RiDeleteBin6Line, RiFileExcel2Line} from 'react-icons/ri';
import {TbEdit, TbTablePlus} from "react-icons/tb";
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";
import {FiUpload} from "react-icons/fi";
import FileUploadModal from "@/Components/FileUploadModal.jsx";

export default function Index({auth, inventoryItems, role, queryParams = null, success}) {
    queryParams = queryParams || {};
    const [modalOpen, setModalOpen] = useState(false);
    const {setData, post} = useForm({
        title: "",
        file: null,
    });
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('inventoryItems.index'), queryParams);
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
        router.get(route('inventoryItems.index'), queryParams);
    }
    const handleDestory = (value) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            router.delete(route('inventoryItems.destroy', value), {preserveScroll: true})
        }
    }
    const handleFileSelect = (file) => {
        setData('file', file);
    };

    function handleSubmit2() {
        post(route("importInventoryItems"));
        setModalOpen(false);
        setData("title", "");
        setData("file", null);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Inventory")}</h2>
                        <InformationIconToolTip
                            content={__("Here you can view all the available inventory items") + '.'}
                            placement="right-end" classname="bg-black" color="black"
                            classnameForIcon="w-5 h-5 ml-1 mt-1"/>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <a name="laboratoryExcel" onClick={() => setModalOpen(true)}><FiUpload
                            className="w-10 h-10 text-amber-400 hover:text-amber-600 hover:rounded hover:bg-gray-50 hover:animate-pulse"/></a>
                        <a href={route("exportInventoryItems")} target="_blank"><RiFileExcel2Line
                            className="w-10 h-10 text-emerald-600 hover:text-emerald-900 hover:rounded hover:bg-gray-50 hover:animate-pulse"/></a>
                        <a href={route("inventoryItems.create")}><TbTablePlus
                            className="w-10 h-10 text-black hover:text-gray-700 hover:rounded hover:bg-gray-50 hover:animate-pulse"/></a>
                    </div>
                </div>
            }
            role={role}
        >
            <Head title="Inventory items"/>
            {success && <div className="bg-emerald-500 py-2 px-4 text-black rounded">{success} </div>}
            <FileUploadModal modalHeaderText={__("Import Excel of data")}
                             alertForWrongType={__("Please select a .xlsx or .csv file")}
                             alertTextForMissingFile={__("Please choose a file before uploading")}
                             submitButtonText={__("Submit")} itemNotSpecifiedText={__("Nothing chosen yet")}
                             selectFileText={__("Chosen file")} isOpen={modalOpen} onClose={handleSubmit2}
                             onFileSelect={handleFileSelect} onSubmit={handleSubmit2}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table
                                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2">ID</th>
                                        <TableHeader
                                            name="local_name"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                            children={__("Barcode")}
                                        />
                                        <TableHeader
                                            name="name"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                            children={__("Name")}
                                        />
                                        <th className="px-3 py-2">{__("Name ENG")}</th>
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
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2">
                                            <TextInput
                                                className="w-full text-sm"
                                                defaultValue={queryParams.local_name}
                                                placeholder={__("Barcode")}
                                                onBlur={e => searchFieldChanged('local_name', e.target.value)}
                                                onKeyPress={e => onKeyPress('local_name', e)}
                                            />
                                        </th>
                                        <th className="px-3 py-2">
                                            <TextInput
                                                className="w-full text-sm"
                                                defaultValue={queryParams.name}
                                                placeholder={__("Name")}
                                                onBlur={e => searchFieldChanged('name', e.target.value)}
                                                onKeyPress={e => onKeyPress('name', e)}/>
                                        </th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2">
                                            <TextInput className="w-full text-sm" placeholder={__("Updated by")}
                                                       defaultValue={queryParams.updated_by}
                                                       onBlur={e => searchFieldChanged('updated_by', e.target.value)}
                                                       onKeyPress={e => onKeyPress('updated_by', e)}/>
                                        </th>
                                        <th className="px-3 py-2"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {inventoryItems.data.map(inventoryItem => (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th className="px-3 py-2">{inventoryItem.id}</th>
                                            <td className="px-3 py-2">{inventoryItem.local_name}</td>
                                            <td className="px-3 py-2">{inventoryItem.name}</td>
                                            <td className="px-3 py-2">{inventoryItem.name_eng}</td>
                                            <td className="px-3 py-2">{inventoryItem.updated_at}</td>
                                            <td className="px-3 py-2">{inventoryItem.created_by.email}</td>
                                            <td className="px-3 py-2">{inventoryItem.updated_by.email}</td>
                                            <td className="flex justify-start mt-1 px-2 py-1">
                                                <Link href={route("inventoryItems.edit", inventoryItem.id)}
                                                      className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1">
                                                    <TbEdit
                                                        className="w-6 h-6 text-emerald-500 hover:text-emerald-700 hover:animate-pulse hover:bg-gray-50"/>
                                                </Link>
                                                <a type="button"
                                                   onClick={() => handleDestory(inventoryItem.id)}><RiDeleteBin6Line
                                                    className="w-6 h-6 text-red-500 hover:text-red-700 hover:animate-pulse hover:bg-gray-50"/></a>
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
