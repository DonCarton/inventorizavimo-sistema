import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';

export default function InventoryTypes({ auth, itemTypes }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Item types</h2>}
        >
            <Head title="Item types" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/*<pre> {JSON.stringify(itemTypes, undefined, 2)} </pre>*/}
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead
                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                <tr className="text-nowrap">
                                    <th className="px-3 py-2">ID</th>
                                    <th className="px-3 py-2">Name</th>
                                    <th className="px-3 py-2">Created by</th>
                                    <th className="px-3 py-2">Updated by</th>
                                    <th className="px-3 py-2 text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {itemTypes.data.map(itemType => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th className="px-3 py-2">{itemType.id}</th>
                                        <td className="px-3 py-2">{itemType.name}</td>
                                        <td className="px-3 py-2">{itemType.created_by.name}</td>
                                        <td className="px-3 py-2">{itemType.updated_by.name}</td>
                                        <td className="px-3 py-2">
                                            <Link href={route("itemTypes.edit", itemType.id)}
                                                className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
