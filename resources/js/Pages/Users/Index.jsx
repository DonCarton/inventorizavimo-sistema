import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm, usePage} from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import {useState} from "react";
import Modal from "@/Components/Modal.jsx";
import InputLabel from "@/Components/InputLabel.jsx";
import {__} from "@/Libs/Lang.jsx";

export default function Users({auth, users, translations, flash}) {
    const [isOpen, setIsOpen] = useState(false)
    const [chosenValue, setChosenValue] = useState('')
    const {localFlash} = flash.message || '';
    const {data, setData, get, errors} = useForm({
        prefix: '',
    });
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Users")}</h2>
                    <Link href={route("users.create")}
                          className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                        {__("Create")}
                    </Link>
                </div>
            }
        >
            <Head title={__("Users")}/>

            <div className="py-12">
                <div>
                    {localFlash && (
                        <div className="alert">{localFlash}</div>
                    )}
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/*<pre> {JSON.stringify(users, undefined, 2)} </pre>*/}
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead
                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2">ID</th>
                                        <th className="px-3 py-2">{__("First name")}</th>
                                        <th className="px-3 py-2">{__("Last name")}</th>
                                        <th className="px-3 py-2">{__("Email")}</th>
                                        <th className="px-3 py-2 text-center">{__("Actions")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {users.data.map(user => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th className="px-3 py-2">{user.id}</th>
                                        <th className="px-3 py-2">{user.first_name}</th>
                                        <th className="px-3 py-2">{user.last_name}</th>
                                        <td className="px-3 py-2">
                                            <Link href={route("users.show", user.id)} className="font-medium text-gray-700 dark:text-white hover:underline mx-1">
                                                {user.email}
                                            </Link>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <Link href={route("users.edit", user.id)}
                                                  className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1">
                                                {__("Edit")}
                                            </Link>
                                            <Link href={route("users.edit", user.id)} className="font-medium text-red-500 dark:text-red-400 hover:underline mx-1">
                                                {__("Delete")}
                                            </Link>
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
