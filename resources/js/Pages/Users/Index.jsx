import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router} from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import {__} from "@/Libs/Lang.jsx";
import {TbEdit, TbTablePlus} from "react-icons/tb";
import {RiDeleteBin6Line, RiFileExcel2Line, RiLockUnlockLine, RiLockLine} from "react-icons/ri";
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";
import React from "react";
import TextInput from "@/Components/TextInput.jsx";
import TableHeader from "@/Components/TableHeader.jsx";
import SuccessMessage from "@/Components/SuccessMessage.jsx";
import FailureMessage from "@/Components/FailureMessage.jsx";

export default function Users({auth, users, role, queryParams = null, success, failure}) {
    queryParams = queryParams || {};
    const handleConfirmMessage = __("Are you sure you want to delete this item")+'?';
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
    const handleDestory = (value) => {
        if (window.confirm(handleConfirmMessage)) {
            router.delete(route('users.destroy', value), {preserveScroll: true})
        }
    }
    const handleDisable = (value) => {
        if (window.confirm(handleConfirmMessage)){
            router.patch(route('users.deactivate', value), {preserveScroll: true})
        }
    }
    const handleEnable = (value) => {
        if (window.confirm(handleConfirmMessage)){
            router.patch(route('users.activate', value), {preserveScroll: true})
        }
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Users")}</h2>
                        <InformationIconToolTip
                            content={__("Here you can view all the available users") + '.'}
                            placement="right-end" classname="bg-black" color="black"
                            classnameForIcon="w-5 h-5 ml-1 mt-1"/>
                    </div>
                    {role === "admin" && (<div className="grid grid-cols-2 gap-4">
                        <a href={route("users.create")}><TbTablePlus
                            className="w-10 h-10 text-black hover:text-gray-700 hover:rounded hover:bg-gray-50 hover:animate-pulse"/></a>
                        <a href={route("exportUsers")} target="_blank"><RiFileExcel2Line
                            className="w-10 h-10 text-emerald-600 hover:text-emerald-900 hover:rounded hover:bg-gray-50 hover:animate-pulse"/></a>
                    </div>)}
                </div>
            }
            role={role}
        >
            <Head title={__("Users")}/>
            <div className="py-12">
                <div className="3xl:max-w-screen-3xl md:max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && <SuccessMessage message={success}/>}
                    {failure && <FailureMessage message={failure}/> }
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead
                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                <tr className="text-nowrap">
                                    <th className="px-3 py-2">ID</th>
                                    <th className="px-3 py-2">{__("First name")}</th>
                                    <th className="px-3 py-2">{__("Last name")}</th>
                                    <TableHeader
                                        name="email"
                                        sort_field={queryParams.sort_field}
                                        sort_direction={queryParams.sort_direction}
                                        sortChanged={sortChanged}
                                        children={__("Email")}
                                    />
                                    <th className="px-3 py-2">{__("Created by")}</th>
                                    <th className="px-3 py-2">{__("Actions")}</th>
                                </tr>
                                </thead>
                                <thead
                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                <tr className="text-nowrap">
                                    <th className="px-3 py-2"></th>
                                    <th className="px-3 py-2"></th>
                                    <th className="px-3 py-2"></th>
                                    <th className="px-3 py-2">
                                        <TextInput
                                            className="w-full text-sm"
                                            defaultValue={queryParams.email}
                                            placeholder={__("Email")}
                                            onBlur={e => searchFieldChanged('email', e.target.value)}
                                            onKeyPress={e => onKeyPress('email', e)}/>
                                    </th>
                                    <th className="px-3 py-2"></th>
                                    <th className="px-3 py-2"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.data.map(user => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th className="px-3 py-2">{user.id}</th>
                                        <th className="px-3 py-2">{user.first_name}</th>
                                        <th className="px-3 py-2">{user.last_name}</th>
                                        <td className="px-3 py-2">
                                            <Link href={route("users.show", user.id)}
                                                  className="font-medium text-gray-700 dark:text-white hover:underline mx-1">
                                                {user.email}
                                            </Link>
                                        </td>
                                        <th className="px-3 py-2">{user.created_by}</th>
                                        <td className="flex justify-start mt-1 px-2 py-1">
                                            <Link href={route("users.edit", user.id)}
                                                  className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1">
                                                <TbEdit
                                                    className="w-6 h-6 text-emerald-500 hover:text-emerald-700 hover:animate-pulse hover:bg-gray-50"/>
                                            </Link>
                                            {
                                                user.is_disabled ?
                                                <a type="button" onClick={() => handleEnable(user.id)}>
                                                    <RiLockUnlockLine className="w-6 h-6 text-blue-500 hover:text-blue-500 hover:animate-pulse hover:bg-gray-50"/>
                                                </a> :
                                                <a type="button" onClick={() => handleDisable(user.id)}>
                                                    <RiLockLine className="w-6 h-6 text-red-500 hover:text-red-500 hover:animate-pulse hover:bg-gray-50"/>
                                                </a>
                                            }
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination links={users.meta.links}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
