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

export default function Index({auth, measurementUnits, success, warning}) {
    return (
        <AuthenticatedLayout user={auth.user}
                             can={auth.can}
                             header={
                                 <div className="flex justify-between items-center">
                                     <div className="flex justify-between">
                                         <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Units")}</h2>
                                         <InformationIconToolTip
                                             content={StringHelper.__("Measurement units used at the end of inventory item codes") + '.'}
                                             placement="right-end" classname="bg-black" color="black"
                                             classnameForIcon="w-5 h-5 ml-1 mt-1"/>
                                     </div>

                                     <GroupButtonDropdown id="dropdown-actions-units" name="actions-units" nameOfDropdownButton={StringHelper.__("Actions")}>
                                         {auth.can.create.measurementUnit && <>
                                             <button type="button" id="create-new-entry"
                                                  className="px-2 py-1 bg-white border-2 rounded-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center sm:text-base 2xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                                                 <Link href={route("measurementUnits.create")}>{StringHelper.__("Create")}</Link></button></>
                                         }
                                     </GroupButtonDropdown>
                                 </div>}
        >
            <Head title={StringHelper.__("Units")}/>
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
                                        <th className="px-3 py-2">{StringHelper.__("Code")}</th>
                                        <th className="px-3 py-2">{StringHelper.__("Name")}</th>
                                        <th className="px-3 py-2">{StringHelper.__("Decimal places")}</th>
                                        <th className="px-3 py-2">{StringHelper.__("Active")}</th>
                                        <th className="px-3 py-2">{StringHelper.__("Items")}</th>
                                        <th className="px-3 py-2">{StringHelper.__("Updated at")}</th>
                                        <th className="px-3 py-2 text-left">{StringHelper.__("Actions")}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {measurementUnits.data.map(unit => (
                                        <tr key={unit.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 sm:text-base">
                                            <td className="px-3 py-2 font-medium text-gray-700 dark:text-white">{unit.code}</td>
                                            <td className="px-3 py-2">{unit.name}</td>
                                            <td className="px-3 py-2">{unit.decimalPlaces}</td>
                                            <td className="px-3 py-2">{unit.isActive ? StringHelper.__("True") : StringHelper.__("False")}</td>
                                            <td className="px-3 py-2">{unit.itemCount}</td>
                                            <td className="px-3 py-2">{unit.updatedAt}</td>
                                            <td className="flex justify-start mt-1 px-2 py-1">
                                                <BulkActionsButton>
                                                    <MiscButton classVariant="green" title={StringHelper.__("Edit")} as="link" to={route("measurementUnits.edit", unit.id)} icon={TbEdit} children={StringHelper.__("Edit")}/>
                                                </BulkActionsButton>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={measurementUnits.meta.links}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
