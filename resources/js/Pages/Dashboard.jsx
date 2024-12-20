import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Link, Head} from '@inertiajs/react';
import StringHelper from "@/Libs/StringHelper.jsx";
import {FaTable, FaUser} from "react-icons/fa";
import {MdOutlineQrCode2} from "react-icons/md";

export default function Dashboard({auth, role}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={<h2
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Dashboard")}</h2>}
            greeting={<div className="p-6 text-gray-900 dark:text-gray-100">{StringHelper.__("Welcome")} {auth.user.name}!</div>}
        >
            <Head title={StringHelper.__("Dashboard")}/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div
                            className="grid xl:grid-cols-2 sm:grid-cols-1 gap-4 p-8">
                            {role.includes('admin') && (<Link href={route("users.index")} className="w-full flex items-center h-24 bg-gray-100 p-4 rounded-lg shadow-md group hover:bg-rose-800 active:bg-pink-900 transition ease-in-out duration-150">
                                <FaUser className="w-16 h-16 text-4xl text-gray-700 group-hover:text-white"/>
                                <div className="ml-4 group-hover:text-white">
                                    <h2 className="text-lg font-semibold">{StringHelper.__("Users")}</h2>
                                    <p className="text-sm">{StringHelper.__("User management")}.</p>
                                </div>
                            </Link>)}
                            <Link href={route("inventoryItems.myLaboratory")}
                                  className="w-full flex items-center h-24 bg-gray-100 p-4 rounded-lg shadow-md group hover:bg-rose-800 active:bg-pink-900 transition ease-in-out duration-150">
                                <FaTable className="w-16 h-16 text-4xl text-gray-700 group-hover:text-white"/>
                                <div className="ml-4 group-hover:text-white">
                                    <h2 className="text-lg font-semibold">{StringHelper.__("My inventory")}</h2>
                                    <p className="text-sm">{StringHelper.__("My inventory management")}.</p>
                                </div>
                            </Link>
                            <Link href={route("inventoryItems.index")}
                                  className="w-full flex items-center h-24 bg-gray-100 p-4 rounded-lg shadow-md group hover:bg-rose-800 active:bg-pink-900 transition ease-in-out duration-150">
                                <FaTable className="w-16 h-16 text-4xl text-gray-700 group-hover:text-white"/>
                                <div className="ml-4 group-hover:text-white">
                                    <h2 className="text-lg font-semibold">{StringHelper.__("Inventory")}</h2>
                                    <p className="text-sm">{StringHelper.__("Inventory management")}.</p>
                                </div>
                            </Link>
                            <Link href={route("reader")}
                                  className="w-full flex items-center h-24 bg-gray-100 p-4 rounded-lg shadow-md group hover:bg-rose-800 active:bg-pink-900 transition ease-in-out duration-150">
                                <MdOutlineQrCode2 className="w-16 h-16 text-4xl text-gray-700 group-hover:text-white"/>
                                <div className="ml-4 group-hover:text-white">
                                    <h2 className="text-lg font-semibold">{StringHelper.__("Reader")}</h2>
                                    <p className="text-sm">{StringHelper.__("Reader interface")}.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
