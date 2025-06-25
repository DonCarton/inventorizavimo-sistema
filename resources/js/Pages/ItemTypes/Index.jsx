import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import {TbEdit} from "react-icons/tb";
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";
import React from "react";
import SuccessMessage from "@/Components/SuccessMessage.jsx";
import WarningMessage from "@/Components/WarningMessage.jsx";
import GroupButtonDropdown from "@/Components/Actions/GroupButtonDropdown.jsx";
import BulkActionsButton from '@/Components/Actions/BulkActionsButton';
import MiscButton from '@/Components/Forms/MiscButton';

export default function InventoryTypes({auth, itemTypes, success, warning}) {
    return (
        <AuthenticatedLayout user={auth.user}
                             can={auth.can}
                             header={
                                 <div className="flex justify-between items-center">
                                     <div className="flex justify-between">
                                         <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Types")}</h2>
                                         <InformationIconToolTip
                                             content={StringHelper.__("Here you can view all the inventory types") + '.'}
                                             placement="right-end" classname="bg-black" color="black"
                                             classnameForIcon="w-5 h-5 ml-1 mt-1"/>
                                     </div>

                                     <GroupButtonDropdown id="dropdown-actions-inventory" name="actions-inventory" nameOfDropdownButton={StringHelper.__("Actions")}>
                                         {auth.can.create.itemType && <>
                                             <button type="button" id="create-new-entry" title="Create a new entry in the current page."
                                                  className="px-2 py-1 bg-white border-2 rounded-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                                 <Link href={route("itemTypes.create")}>{StringHelper.__("Create")}</Link></button></>
                                         }
                                     </GroupButtonDropdown>
                                 </div>}
        >
            <Head title={StringHelper.__("Types")}/>
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
                                        <th className="px-3 py-2">{StringHelper.__("Name")}</th>
                                        <th className="px-3 py-2">{StringHelper.__("Updated at")}</th>
                                        <th className="px-3 py-2">{StringHelper.__("Updated by")}</th>
                                        <th className="px-3 py-2 text-left">{StringHelper.__("Actions")}</th>
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
                                                <BulkActionsButton>
                                                    <MiscButton className="w-36" classVariant="green" title={StringHelper.__("Edit")} as="link" to={route("itemTypes.edit", itemType.id)} icon={TbEdit} children={StringHelper.__("Edit")}/>
                                                </BulkActionsButton>
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
