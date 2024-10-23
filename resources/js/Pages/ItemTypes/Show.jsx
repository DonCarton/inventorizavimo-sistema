import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link} from "@inertiajs/react";
import StringHelper from "@/Libs/StringHelper.jsx";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import {useState} from "react";

export default function Show({ auth, itemType, previousUrl }) {
    const [previousUrlPage] = useState(previousUrl);
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Edit")} - {itemType.data.name}</h2>}
        >
            <Head title={StringHelper.__("Edit") + " - " + itemType.data.name} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="itemType_name">{StringHelper.__("Name")}</InputLabel>
                                    <TextInput id="itemType_name" type="text" name="name" value={itemType.data.name}
                                               className="mt-1 block w-full disabled:text-white disabled:bg-gray-400" disabled={true} readOnly={true}/>
                                </div>
                                <div className="mt-4">
                                    <label>
                                        <input
                                            disabled={true}
                                            className="mr-2 rounded w-6 h-6 disabled:text-white disabled:bg-gray-400 disabled:hover:bg-gray-500"
                                            type="checkbox"
                                            checked={itemType.data.changeAccAmount}
                                        />
                                        {StringHelper.__("Can change literal amount")}?
                                    </label>
                                </div>
                                <div className="mt-4">
                                    <Link href={previousUrlPage}
                                          className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        {StringHelper.__("Cancel")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
