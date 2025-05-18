import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState} from 'react';
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import StringHelper from "@/Libs/StringHelper";
import SteamDropdown from "@/Components/SteamDropdown";
import FieldMappingForm from "@/Components/Forms/FieldMappingForm";

export default function Create({ auth, importRun }) {
    const { data, setData, patch, errors, processing } = useForm({
        file: null,
    });
    const onSubmit = (e) => {
        e.preventDefault();
        patch(
            route('import-runs.update', {
                import_run: importRun.id
            })
        );
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Edit import run")}</h2>
                </div>
            }
        >
            <Head title={StringHelper.__("Edit import run")} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="mt-4">
                            <InputLabel>{StringHelper.__("Status")}</InputLabel>
                            <TextInput className="w-full" disabled={true} readOnly={true} value={importRun.status}/>
                        </div>
                        <div className="mt-4">
                            <InputLabel>{StringHelper.__("File")}</InputLabel>
                            <TextInput className="w-full" disabled={true} readOnly={true} value={importRun.file_path}/>
                        </div>
                        <div className="mt-2">
                            <Link href={route("import-runs.index")}
                                className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                {StringHelper.__("Cancel")}
                            </Link>
                            <PrimaryButton className="ml-2" disabled={processing}>{StringHelper.__("Save")}</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
