import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router} from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import {__} from '@/Libs/Lang.jsx';
import {TbEdit, TbTablePlus} from "react-icons/tb";
import {RiDeleteBin6Line} from "react-icons/ri";

export default function InventoryTypes({auth, itemTypes, role}) {
    const handleDestory = (value) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            router.delete(route('itemTypes.destroy', value), {preserveScroll: true})
        }
    }
    return (
        <AuthenticatedLayout user={auth.user}
                             header={
                                 <div className="flex justify-between items-center"><h2
                                     className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Types")}
                                 </h2>
                                     <div className="grid grid-cols-2 gap-4">
                                         <a href={route("itemTypes.create")}><TbTablePlus
                                             className="w-10 h-10 text-black hover:text-gray-700 hover:rounded hover:bg-gray-50 hover:animate-pulse"/></a>
                                     </div>
                                 </div>}
                             role={role}
        >
            <Head title={__("Types")}/>
            <div className="py-12">
                <div className="3xl:max-w-screen-3xl md:max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead
                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                <tr className="text-nowrap">
                                    <th className="px-3 py-2">ID</th>
                                    <th className="px-3 py-2">{__("Name")}</th>
                                    <th className="px-3 py-2">{__("Updated at")}</th>
                                    <th className="px-3 py-2">{__("Updated by")}</th>
                                    <th className="px-3 py-2 text-left">{__("Actions")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {itemTypes.data.map(itemType => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th className="px-3 py-2">{itemType.id}</th>
                                        <td className="px-3 py-2">
                                            <Link href={route("itemTypes.show", itemType.id)}
                                                  className="font-medium text-gray-700 dark:text-white hover:underline mx-1">
                                                {itemType.name}
                                            </Link>
                                        </td>
                                        <td className="px-3 py-2">{itemType.updated_at}</td>
                                        <td className="px-3 py-2">{itemType.updated_by.email}</td>
                                        <td className="flex justify-start mt-1 px-2 py-1">
                                            <Link href={route("itemTypes.edit", itemType.id)}
                                                  className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1">
                                                <TbEdit
                                                    className="w-6 h-6 text-emerald-500 hover:text-emerald-700 hover:animate-pulse hover:bg-gray-50"/>
                                            </Link>
                                            <a type="button"
                                               onClick={() => handleDestory(itemType.id)}><RiDeleteBin6Line
                                                className="w-6 h-6 text-red-500 hover:text-red-700 hover:animate-pulse hover:bg-gray-50"/></a>
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
