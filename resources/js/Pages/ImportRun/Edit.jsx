import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {FiUpload,FiDownload} from 'react-icons/fi';
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useRef } from 'react';
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import StringHelper from "@/Libs/StringHelper";
import SteamDropdown from "@/Components/SteamDropdown";

export default function Create({ auth, importRun, importStatuses }) {
    const [fileName, setFileName] = useState(importRun.file_path);

    const fileInputRef = useRef(null);
    const { data, setData, post, errors, processing } = useForm({
        file: null,
        _method: 'PATCH',
    });

    const handleUploadClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };

    const handleDownloadClick = (e) => {
        e.preventDefault();
        if (importRun.file_path) {
            window.open(route('import-runs.download', importRun.id), '_blank');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('file', file);
        setFileName(file.name);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        post(route('import-runs.update', importRun.id), {
            forceFormData: true,
        });
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
                            <SteamDropdown className="w-full disabled:bg-gray-400 disabled:text-white" options={importStatuses} disabled={true} value={importRun.status}/>
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="file">{StringHelper.__("File for import definition")}</InputLabel>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleUploadClick}
                                    className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                    title={StringHelper.__("Upload")}
                                >
                                    <FiUpload/>
                                    <span className="ml-2">{StringHelper.__("Upload")}</span>
                                </button>

                                <button
                                    onClick={handleDownloadClick}
                                    className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                    title={StringHelper.__("Download")}
                                    disabled={!importRun.file_path}
                                >
                                    <FiDownload/>
                                    <span className="ml-2">{StringHelper.__("Download")}</span>
                                </button>

                                <TextInput
                                    className="w-full disabled:bg-gray-400 disabled:text-white"
                                    disabled
                                    readOnly
                                    value={fileName}
                                    title={fileName}
                                />
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />

                            <InputError message={errors.file} className="mt-2" />
                        </div>
                        <div className="mt-6 flex justify-start">
                            <Link
                                href={route("import-runs.index")}
                                className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                {StringHelper.__("Cancel")}
                            </Link>
                            <PrimaryButton className="ml-2" disabled={processing}>
                                {StringHelper.__("Save")}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
