import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import { TbEdit } from "react-icons/tb";
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";
import React from "react";
import TextInput from "@/Components/TextInput.jsx";
import TableHeader from "@/Components/TableHeader.jsx";
import SuccessMessage from "@/Components/SuccessMessage.jsx";
import FailureMessage from "@/Components/FailureMessage.jsx";

export default function Index({ auth, importDefinitions, queryParams = null, flash }) {
    queryParams = queryParams || {};
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('import-definitions.index'), queryParams);
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
        router.get(route('import-definitions.index'), queryParams);
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Import definitions")}</h2>
                        <InformationIconToolTip
                            content={StringHelper.__("Here you can view all the available users") + '.'}
                            placement="right-end" classname="bg-black" color="black"
                            classnameForIcon="w-5 h-5 ml-1 mt-1" />
                    </div>
                    <div>
                        <Link href={route("import-definitions.create")} id="create-new-entry" title="Create a new entry in the current page."
                            className="px-3 py-2 bg-white border-2 rounded-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                {StringHelper.__("Create")}
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={StringHelper.__("Import definitions")} />
            <div className="py-12">
                <div className="3xl:max-w-screen-3xl md:max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.success && <SuccessMessage message={flash.success}/>}
                    {flash.failure && <FailureMessage message={flash.failure}/>}
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
                                            <th className="px-3 py-2">{StringHelper.__("Type")}</th>
                                            <TableHeader
                                                name="updated_at"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                                children={StringHelper.__("Updated at")}
                                            />
                                            <th className="px-3 py-2">{StringHelper.__("Created by")}</th>
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
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {importDefinitions.data.map(importDefinition => (
                                            <tr key={importDefinition.id}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 sm:text-base">
                                                <td className="px-3 py-2">
                                                    <Link href={route("import-definitions.edit", importDefinition.id)}
                                                        className="font-medium text-gray-700 dark:text-white hover:underline mx-1">
                                                        {importDefinition.name}
                                                    </Link>
                                                </td>
                                                <td className="px-3 py-2">{importDefinition.model_class}</td>
                                                <td className="px-3 py-2">{importDefinition.updated_at}</td>
                                                <td className="px-3 py-2">{importDefinition.created_by}</td>
                                                <td className="flex justify-start mt-1 px-2 py-1">
                                                    <Link href={route("import-definitions.edit", importDefinition.id)}
                                                        className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1">
                                                        <TbEdit
                                                            className="w-8 h-8 text-emerald-500 hover:text-emerald-700 hover:animate-pulse hover:bg-gray-50" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={importDefinitions.meta.links}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
