import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from 'react';
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import StringHelper from "@/Libs/StringHelper";
import SteamDropdown from "@/Components/SteamDropdown";
import FieldMappingForm from "@/Components/Forms/FieldMappingForm";

export default function Create({ auth, importableObjects }) {
    const [availableFields, setAvailableFields] = useState([]);
    const [fileHeaders, setFileHeaders] = useState([]);

    const { data, setData, post, errors, processing } = useForm({
        name: '',
        model_class: '',
        file: null,
        field_mappings: {},
    });
    const handleModelChange = async e => {
        const model = e.target.value
        setData('model_class', model)

        const response = await axios.post(route('imports.importableFields', { model }));
        setAvailableFields(response.data.fields);
    };
    const handleFileChange = async e => {
        const file = e.target.files[0]
        setData('file', file)

        const formData = new FormData()
        formData.append('file', file)
        const response = await axios.post(route('imports.previewHeaders'), formData);
        setFileHeaders(response.data.headers)
    };
    const onSubmit = (e) => {
        e.preventDefault();
        post(route('import-definitions.store'));
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Create new import")}</h2>
                </div>
            }
        >
            <Head title={StringHelper.__("Create new import")} />
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
                            <select id="import_definition_model_class" name="import_definition_model_class" className="mt-1 block w-full border rounded-lg" onChange={handleModelChange}>
                                <option value="">{StringHelper.__("Choose a value")}</option>
                                {
                                    importableObjects.map(({ value, label }) =>
                                        (<option key={value} value={value}>{label}</option>)

                                    )
                                }
                            </select>
                            <InputError message={errors.model_class} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <label>File</label>
                            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="w-full" />
                        </div>
                        {fileHeaders.length > 0 && availableFields.length > 0 && (
                            <div className="mt-4">
                                <InputLabel htmlFor="import_definition_field_mappings">{StringHelper.__("Mappings")}<span className="text-red-500">*</span></InputLabel>
                                <FieldMappingForm id="import_definition_field_mappings"
                                    selectedModel={data.model_class}
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
