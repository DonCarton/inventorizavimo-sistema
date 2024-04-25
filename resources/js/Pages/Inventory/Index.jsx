import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";

export default function InventoryTypes({auth, inventoryItems}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Inventory
                        items</h2>
                    <Link href={route("inventoryItems.create")}
                          className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                        Add new
                    </Link>
                </div>
            }
        >
            <Head title="Inventory items"/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/*<pre>{JSON.stringify(inventoryItems, undefined, 2)}</pre>*/}
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead
                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                <tr className="text-nowrap">
                                    <th className="px-3 py-2">ID</th>
                                    <th className="px-3 py-2">Local name</th>
                                    <th className="px-3 py-2">Type by duration</th>
                                    <th className="px-3 py-2">Type by use</th>
                                    <th className="px-3 py-2">Name</th>
                                    <th className="px-3 py-2">Name in English</th>
                                    <th className="px-3 py-2">Created at</th>
                                    <th className="px-3 py-2">Updated at</th>
                                    <th className="px-3 py-2">Created by</th>
                                    <th className="px-3 py-2">Updated by</th>
                                    <th className="px-3 py-2">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {inventoryItems.data.map(inventoryItem => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th className="px-3 py-2">{inventoryItem.id}</th>
                                        <td className="px-3 py-2">{inventoryItem.local_name}</td>
                                        <td className="px-3 py-2">{inventoryItem.type_by_duration}</td>
                                        <td className="px-3 py-2">{inventoryItem.type_by_use}</td>
                                        <td className="px-3 py-2">{inventoryItem.name}</td>
                                        <td className="px-3 py-2">{inventoryItem.name_eng}</td>
                                        <td className="px-3 py-2">{inventoryItem.created_at}</td>
                                        <td className="px-3 py-2">{inventoryItem.updated_at}</td>
                                        <td className="px-3 py-2">{inventoryItem.created_by.name}</td>
                                        <td className="px-3 py-2">{inventoryItem.updated_by.name}</td>
                                        <td className="px-3 py-2">
                                            <Link href={route("inventoryItems.edit", inventoryItem.id)}
                                                  className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <Pagination links={inventoryItems.meta.links}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
