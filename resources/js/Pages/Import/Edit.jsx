import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {FiUpload} from 'react-icons/fi';
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useRef } from 'react';
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import StringHelper from "@/Libs/StringHelper";
import SteamDropdown from "@/Components/SteamDropdown";
import FieldMappingForm from "@/Components/Forms/FieldMappingForm";

export default function Create({ auth, importableObjects, fileDownloadUrl, headers, importDefinition, originalFilename }) {
    const [fileHeaders, setFileHeaders] = useState(headers || []);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const fileInputRef = useRef(null);
    const { data, setData, put, errors, processing } = useForm({
        name: importDefinition.name || '',
        model_class: importDefinition.model_class || '',
        file: importDefinition.file || null,
        field_mappings: importDefinition.field_mappings || {},
    });
    const handleButtonClick = (e) => {
        if (confirm('Changing the file will reset the mappings, do you wish to proceed?')){
            fileInputRef.current.click();
        } else {
            return;
        }
    };
    const handleModelChange = (e) => {
        const model = e.target.value
        setData('model_class', model)
    };
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setData('file', file);

        const formData = new FormData();
        formData.append('file', file);
        if (file) {
            setSelectedFileName(file.name);
        }
        const response = await axios.post(route('imports.previewHeaders'), formData);
        setFileHeaders(response.data.headers);
    };
    const onSubmit = (e) => {
        e.preventDefault();
        put(route('import-definitions.update', {import_definition: importDefinition.id}));
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Edit import definition")}</h2>
                </div>
            }
        >
            <Head title={StringHelper.__("Edit import definition")} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="mt-4">
                            <InputLabel htmlFor="import_definition_name">{StringHelper.__("Name")}<span className="text-red-500">*</span></InputLabel>
                            <TextInput id="import_definition_name" type="text" name="import_definition_name" value={data.name}
                                className="mt-1 block w-full"
                                onChange={e => setData('name', e.target.value)} />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="import_definition_model_class">{StringHelper.__("Record type")}<span className="text-red-500">*</span></InputLabel>
                            <SteamDropdown
                                id="import_definition_model_class"
                                name="import_definition_model_class"
                                value={data.model_class}
                                onChange={handleModelChange}
                                options={importableObjects}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.model_class} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            {fileDownloadUrl && (
                                <div className="mb-2">
                                    <a href={fileDownloadUrl} className="text-blue-600 underline" download>
                                        Download current file ({originalFilename})
                                    </a>
                                </div>
                            )}
                            <div>
                                <input type="file" accept=".csv,.xlsx,.xls" ref={fileInputRef} style={{display: 'none'}} onChange={handleFileChange} className="w-full" />
                                <div className="flex gap-2">
                                    {selectedFileName ?
                                        <div className="w-full text-center">
                                            <p className="font-semibold">{StringHelper.__("Chosen file")}</p>
                                            <TextInput className="w-full" readOnly={true} disabled={true} value={selectedFileName}/>
                                        </div>
                                        :
                                        <div className="w-full text-center">
                                            <p className="font-semibold">{StringHelper.__("Chosen file")}</p>
                                            <TextInput className="w-full" readOnly={true} disabled={true} value={originalFilename}/>
                                        </div>
                                    }
                                        <div className="flex flex-none justify-center">
                                            <button type="button" className="flex w-16 items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-100" onClick={handleButtonClick}>
                                                <FiUpload className="mr-2"/>
                                            </button>
                                        </div>
                                </div>

                            </div>
                        </div>
                        {data.model_class.length > 0 && (
                            <div className="mt-4">
                                <InputLabel htmlFor="import_definition_field_mappings">{StringHelper.__("Mappings")}<span className="text-red-500">*</span></InputLabel>                                
                                <div className="grid grid-cols-2">
                                    <div>Field in file</div>
                                    <div>Field in system</div>
                                </div>
                                <FieldMappingForm id="import_definition_field_mappings"
                                                  model={data.model_class}
                                                  fileHeaders={fileHeaders}
                                                  value={data.field_mappings}
                                                  onChange={mapping => setData('field_mappings', mapping)}
                                />
                                <InputError message={errors.field_mappings} className="mt-2" />
                            </div>
                        )}
                        <div className="mt-2">
                            <Link href={route("import-definitions.index")}
                                className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                {StringHelper.__("Cancel")}
                            </Link>
                            <PrimaryButton className="ml-2" disabled={processing}>{StringHelper.__("Create")}</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
