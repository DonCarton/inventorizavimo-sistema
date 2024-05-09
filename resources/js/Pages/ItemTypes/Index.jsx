import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import {__} from '@/Libs/Lang.jsx';

export default function InventoryTypes({ auth, itemTypes }) {
    return (
        <AuthenticatedLayout user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Types")}</h2>}
        >
            <Head title={__("Types")} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/*<pre> {JSON.stringify(itemTypes, undefined, 2)} </pre>*/}
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2">ID</th>
                                        <th className="px-3 py-2">{__("Name")}</th>
                                        <th className="px-3 py-2">{__("Updated at")}</th>
                                        <th className="px-3 py-2">{__("Updated by")}</th>
                                        <th className="px-3 py-2 text-center">{__("Actions")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {itemTypes.data.map(itemType => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th className="px-3 py-2">{itemType.id}</th>
                                        <td className="px-3 py-2">
                                            <Link href={route("itemTypes.edit", itemType.id)} className="font-medium text-gray-700 dark:text-white hover:underline mx-1">
                                                {itemType.name}
                                            </Link>
                                        </td>
                                        <td className="px-3 py-2">{itemType.updated_at}</td>
                                        <td className="px-3 py-2">{itemType.updated_by.email}</td>
                                        <td className="px-3 py-2 text-center">
                                            <Link href={route("itemTypes.edit", itemType.id)} className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1">
                                                {__("Edit")}
                                            </Link>
                                            <Link href={route("itemTypes.edit", itemType.id)} className="font-medium text-red-500 dark:text-red-400 hover:underline mx-1">
                                                {__("Delete")}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <Pagination links={itemTypes.meta.links}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
