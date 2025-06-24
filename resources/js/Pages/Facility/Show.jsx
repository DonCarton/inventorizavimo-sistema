import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import FlexibleStaticSelect from "@/Components/Forms/FlexibleStaticSelect";

export default function Show({ auth, facility, laboratories }) {
    return (<AuthenticatedLayout
        user={auth.user}
        can={auth.can}
        header={<h2
            className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Show")} - {facility.name}</h2>}
    >
        <Head title={StringHelper.__("Show") + " - " + facility.name} />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="mt-4">
                            <InputLabel htmlFor="facility_name">{StringHelper.__("Name")}</InputLabel>
                            <TextInput id="facility_name" type="text" name="name" value={facility.name} disabled={true} readOnly={true}
                                className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="facility_laboratory">{StringHelper.__("Laboratory")}</InputLabel>
                            <FlexibleStaticSelect id="facility_laboratory" options={laboratories} value={facility.laboratory} customIsDisabled={true} customIsMulti={true} customNoOptionsMessage="" />
                        </div>
                        <div className="mt-4">
                            <Link href={route('facilities.index')}
                                className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                {StringHelper.__("Cancel")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>);
}
