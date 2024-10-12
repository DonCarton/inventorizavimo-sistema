import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router} from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import {__} from '@/Libs/Lang.jsx';
import {TbEdit} from "react-icons/tb";
import {RiDeleteBin6Line} from "react-icons/ri";
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";
import React from "react";
import SuccessMessage from "@/Components/SuccessMessage.jsx";
import WarningMessage from "@/Components/WarningMessage.jsx";
import GroupButtonDropdown from "@/Components/Actions/GroupButtonDropdown.jsx";

export default function InventoryTypes({auth, itemTypes, role, success, warning}) {
    const handleConfirmMessage = __("Are you sure you want to delete this item")+'?';
    const handleDestroy = (value) => {
        if (window.confirm(handleConfirmMessage)) {
            router.delete(route('itemTypes.destroy', value), {preserveScroll: true})
        }
    }
    return (
        <AuthenticatedLayout user={auth.user}
                             header={
                                 <div className="flex justify-between items-center">
                                     <div className="flex justify-between">
                                         <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Types")}</h2>
                                         <InformationIconToolTip
                                             content={__("Here you can view all the inventory types") + '.'}
                                             placement="right-end" classname="bg-black" color="black"
                                             classnameForIcon="w-5 h-5 ml-1 mt-1"/>
                                     </div>

                                     <GroupButtonDropdown id="dropdown-actions-inventory" name="actions-inventory" nameOfDropdownButton={__("Actions")}>
                                         {role === 'admin' && <>
                                             <div id="create-new-entry" title="Create a new entry in the current page."
                                                  className="px-2 py-1 bg-white border-2 rounded-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                                 <Link href={route("itemTypes.create")}>{__("Create")}</Link></div></>
                                         }
                                     </GroupButtonDropdown>
                                 </div>}
                             role={role}
        >
            <Head title={__("Types")}/>
            <div className="py-12">
                <div className="3xl:max-w-screen-3xl md:max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && <SuccessMessage message={success}/>}
                    {warning && <WarningMessage message={warning}/>}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead
                                        className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2">{__("Name")}</th>
                                        <th className="px-3 py-2">{__("Updated at")}</th>
                                        <th className="px-3 py-2">{__("Updated by")}</th>
                                        <th className="px-3 py-2 text-left">{__("Actions")}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {itemTypes.data.map(itemType => (
                                        <tr key={itemType.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 sm:text-base">
                                            <td className="px-3 py-2">
                                                <Link href={route("itemTypes.show", itemType.id)}
                                                      className="font-medium text-gray-700 dark:text-white hover:underline mx-1">
                                                    {itemType.name}
                                                </Link>
                                            </td>
                                            <td className="px-3 py-2">{itemType.updatedAt}</td>
                                            <td className="px-3 py-2">{itemType.updatedBy.email}</td>
                                            <td className="flex justify-start mt-1 px-2 py-1">
                                                <Link href={route("itemTypes.edit", itemType.id)}
                                                      className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1">
                                                    <TbEdit
                                                        className="w-8 h-8 text-emerald-500 hover:text-emerald-700 hover:animate-pulse hover:bg-gray-50"/>
                                                </Link>
                                                <a type="button"
                                                   onClick={() => handleDestroy(itemType.id)}><RiDeleteBin6Line
                                                    className="w-8 h-8 text-red-500 hover:text-red-700 hover:animate-pulse hover:bg-gray-50"/></a>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={itemTypes.meta.links}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
