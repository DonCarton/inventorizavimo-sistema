import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router} from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import {TbEdit} from "react-icons/tb";
import {RiLockUnlockLine, RiLockLine} from "react-icons/ri";
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";
import React from "react";
import TextInput from "@/Components/TextInput.jsx";
import TableHeader from "@/Components/TableHeader.jsx";
import SuccessMessage from "@/Components/SuccessMessage.jsx";
import FailureMessage from "@/Components/FailureMessage.jsx";
import GroupButtonDropdown from "@/Components/Actions/GroupButtonDropdown.jsx";
import MiscButton from '@/Components/Forms/MiscButton';
import BulkActionsButton from '@/Components/Actions/BulkActionsButton';

export default function Users({auth, users, queryParams = null, success, failure}) {
    queryParams = queryParams || {};
    const handleDisableMessage = StringHelper.__("Are you sure you want to deactivate this user")+'?';
    const handleEnableMessage = StringHelper.__("Are you sure you want to activate this user")+'?';
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('users.index'), queryParams);
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
        router.get(route('users.index'), queryParams);
    }
    const handleDisable = (value) => {
        if (window.confirm(handleDisableMessage)){
            router.patch(route('users.deactivate', value), {preserveScroll: true})
        }
    }
    const handleEnable = (value) => {
        if (window.confirm(handleEnableMessage)){
            router.patch(route('users.activate', value), {preserveScroll: true})
        }
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Users")}</h2>
                        <InformationIconToolTip
                            content={StringHelper.__("Here you can view all the available users") + '.'}
                            placement="right-end" classname="bg-black" color="black"
                            classnameForIcon="w-5 h-5 ml-1 mt-1"/>
                    </div>
                    <GroupButtonDropdown id="dropdown-actions-inventory" name="actions-inventory" nameOfDropdownButton={StringHelper.__("Actions")}>
                        {auth.can.create.user && <>
                            <button type="button" id="create-new-entry" title="Create a new entry in the current page."
                                 className="px-2 py-1 bg-white border-t-2 border-l-2 border-r-2 rounded-t-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                <Link href={route("users.create")}>
                                    {StringHelper.__("Create")}
                                </Link></button>
                            <button type="button" id="export-entries" title="Export all data from the database or export a specific set with the defined search paramters in the table."
                                 className="px-2 py-1 bg-white border-2 rounded-b-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                <a href={route("adminExports.users", queryParams)}>{StringHelper.__("Export")}</a></button></>
                        }
                    </GroupButtonDropdown>
                </div>
            }
        >
            <Head title={StringHelper.__("Users")}/>
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
                                        className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2">{StringHelper.__("First name")}</th>
                                        <th className="px-3 py-2">{StringHelper.__("Last name")}</th>
                                        <TableHeader
                                            name="email"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                            children={StringHelper.__("Email")}
                                        />
                                        <th className="px-3 py-2">{StringHelper.__("Created by")}</th>
                                        <th className="px-3 py-2">{StringHelper.__("Actions")}</th>
                                    </tr>
                                    </thead>
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2">
                                            <TextInput
                                                className="w-full 3xl:text-base text-sm"
                                                defaultValue={queryParams.email}
                                                placeholder={StringHelper.__("Email")}
                                                onBlur={e => searchFieldChanged('email', e.target.value)}
                                                onKeyPress={e => onKeyPress('email', e)}/>
                                        </th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.data.map(user => (
                                        <tr key={user.id}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 sm:text-base">
                                            <th className="px-3 py-2">{user.first_name}</th>
                                            <th className="px-3 py-2">{user.last_name}</th>
                                            <td className="px-3 py-2">
                                                <Link href={route("users.show", user.id)}
                                                      className="font-medium text-gray-700 dark:text-white hover:underline mx-1">
                                                    {user.email}
                                                </Link>
                                            </td>
                                            <th className="px-3 py-2">{user.created_by}</th>
                                            <td className="flex justify-start mt-1 mb-1 px-2 py-1 space-x-2">
                                                <div>
                                                    <BulkActionsButton>
                                                        <MiscButton classVariant="green" title={StringHelper.__("Edit")} as="link" to={route("users.edit", user.id)} icon={TbEdit} children={StringHelper.__("Edit")}/>
                                                        {
                                                            user.is_disabled
                                                            ?
                                                            <MiscButton classVariant="blue" title={StringHelper.__("Unblock")} as="button" onClick={() => handleEnable(user.id)} icon={RiLockUnlockLine} children={StringHelper.__("Unblock")}/>
                                                            :
                                                            <MiscButton classVariant="red" title={StringHelper.__("Block")} as="button" onClick={() => handleDisable(user.id)} icon={RiLockLine} children={StringHelper.__("Block")}/>
                                                        }
                                                    </BulkActionsButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={users.meta.links}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
