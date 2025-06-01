import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";
import React from "react";
import TextInput from "@/Components/TextInput.jsx";
import TableHeader from "@/Components/TableHeader.jsx";
import SuccessMessage from "@/Components/SuccessMessage.jsx";
import FailureMessage from "@/Components/FailureMessage.jsx";
import { VscDebugRerun } from "react-icons/vsc";
import SteamDropdown from '@/Components/SteamDropdown';
import GroupButtonDropdown from "@/Components/Actions/GroupButtonDropdown.jsx";
import WarningMessage from '@/Components/WarningMessage';
import { IoMdRefresh } from "react-icons/io";
import DeleteButton from '@/Components/Forms/DeleteButton';
import EditButton from '@/Components/Forms/EditButton';
import MiscButton from '@/Components/Forms/MiscButton';

export default function Index({ auth, importRuns, importStatuses, queryParams = null, flash }) {
    const handleConfirmMessage = StringHelper.__("Are you sure you want to delete this item") + '?';
    queryParams = queryParams || {};
    const {delete: destroy, processing} = useForm();
    const handleDestroy = (value) => {
        if (window.confirm(handleConfirmMessage)) {
            destroy(route('import-runs.destroy', value));
        }
    }
    const refreshPage = (e) => {
        router.get(route('import-runs.index'), queryParams);
    }
    const onSelectChange = (name, e) => {
        searchFieldChanged(name, e.target.value);
    }
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('import-runs.index'), queryParams);
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
        router.get(route('import-runs.index'), queryParams);
    }
    const handleRequeue = (value) => {
        router.patch(route('import-runs.requeue', value), { preserveScroll: true });
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Import runs")}</h2>
                        <InformationIconToolTip
                            content={StringHelper.__("Here you can view all of the defined import runs") + '.'}
                            placement="right-end" classname="bg-black" color="black"
                            classnameForIcon="w-5 h-5 ml-1 mt-1" />
                    </div>
                    <div className="flex justify-between">
                        <div className="pt-1 mr-2">
                            <button title="Perkrauti puslapį" onClick={refreshPage} className="w-10 h-10 flex items-center justify-center rounded-lg hover:animate-pulse hover:bg-gray-300">
                                <IoMdRefresh className="w-8 h-8"/>
                            </button>
                        </div>
                        <GroupButtonDropdown id="dropdown-actions-inventory" name="actions-inventory" nameOfDropdownButton={StringHelper.__("Actions")}>
                            {auth.can.create.importRun && <>
                                <Link href={route("import-runs.create")}>
                                    <button type="button" disabled id="create-new-entry" title={StringHelper.__("Create a new entry in the current page")}
                                        className="px-2 py-1 bg-white border-t-2 border-l-2 border-r-2 rounded-t-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                        {StringHelper.__("Create")}
                                    </button>
                                </Link>
                                <Link href={route("import-definitions.index")}>
                                    <button type="button" id="import-entries" title={StringHelper.__("Import definitions")}
                                        className="px-2 py-1 bg-white border-2 rounded-b-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                        {StringHelper.__("Import definitions")}
                                    </button>
                                </Link></>
                            }
                        </GroupButtonDropdown>
                    </div>
                </div>
            }
        >
            <Head title={StringHelper.__("Import runs")} />
            <div className="py-12">
                <div className="3xl:max-w-screen-3xl md:max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.success && <SuccessMessage message={flash.success} />}
                    {flash.failure && <FailureMessage message={flash.failure} />}
                    {flash.warning && <WarningMessage message={flash.warning} />}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table
                                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead
                                        className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-2">{StringHelper.__("Name")}</th>
                                            <th className="px-3 py-2">{StringHelper.__("Type")}</th>
                                            <TableHeader
                                                name="status"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                                children={StringHelper.__("Status")}
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
                                                    defaultValue={queryParams.definition_name}
                                                    placeholder={StringHelper.__("Name")}
                                                    onBlur={e => searchFieldChanged('definition_name', e.target.value)}
                                                    onKeyPress={e => onKeyPress('definition_name', e)} />
                                            </th>
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2">
                                                <SteamDropdown name="import_run_query_select" className="w-full 3xl:text-base text-sm text-gray-500" value={queryParams.status} options={importStatuses} onChange={e => onSelectChange('status', e)} />
                                            </th>
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {importRuns.data.map(importRun => (
                                            <tr key={importRun.id}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 sm:text-base">
                                                <td className="px-3 py-2">{importRun.definition_name}</td>
                                                <td className="px-3 py-2">{importRun.model_class}</td>
                                                <td className="px-3 py-2">{importRun.status}</td>
                                                <td className="px-3 py-2">{importRun.created_by}</td>
                                                <td className="flex justify-start mt-1 px-2 py-1 space-x-2">
                                                    <EditButton title={StringHelper.__("Edit")} href={route("import-runs.edit", importRun.id)} disabled={processing}>{StringHelper.__("Edit")}</EditButton>
                                                    <MiscButton title={StringHelper.__("Rerun last import")} as="button" onClick={() => handleRequeue(importRun.id)} disabled={processing} icon={VscDebugRerun} children={StringHelper.__("Rerun last import")}/>
                                                    <DeleteButton title={StringHelper.__("Delete")} type="button" disabled={processing} onClick={() => handleDestroy(importRun.id)} children={StringHelper.__("Delete")}/>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={importRuns.meta.links}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
