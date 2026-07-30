import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect, lazy, Suspense } from 'react';
import axios from "axios";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import StringHelper from "@/Libs/StringHelper";
import SteamDropdown from "@/Components/SteamDropdown";
import FieldMappingSummary from "@/Components/Forms/FieldMappingSummary";
import { FiDownload } from "react-icons/fi";

// react-spreadsheet-import pulls in Chakra UI/Emotion/react-data-grid (~1MB minified) —
// lazy-load so that weight is only fetched once the user opens the mapping modal.
const SpreadsheetImportModal = lazy(() => import("@/Components/Forms/SpreadsheetImportModal"));

export default function Create({ auth, importableObjects, rawHeaders, normalizedHeaders, sampleRows, importDefinition, originalFilename }) {
    const confirmMessage = StringHelper.__("Changing the object type reset the mappings, do you wish to proceed?");
    const { data, setData, patch, errors, processing } = useForm({
        name: importDefinition.name || '',
        model_class: importDefinition.model_class || '',
        file: importDefinition.file || null,
        field_mappings: importDefinition.field_mappings || {},
    });
    const [importableFields, setImportableFields] = useState([]);
    const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);

    const handleModelChange = (e) => {
        if (confirm(confirmMessage)) {
            const model = e.target.value
            // Inertia's useForm().setData(key, value) reads from the closure-captured `data`,
            // so two separate calls in one handler would clobber each other — merge into one.
            setData((current) => ({ ...current, model_class: model, field_mappings: {} }))
        } else {
            return;
        }
    };

    useEffect(() => {
        if (!data.model_class) {
            setImportableFields([]);
            return;
        }

        let cancelled = false;

        axios
            .post(route("imports.importableFields", { model: data.model_class }))
            .then((response) => {
                if (cancelled) return;
                setImportableFields(
                    Object.entries(response.data.humanReadable).map(
                        ([key, label]) => ({
                            key,
                            label,
                            fieldType: { type: "input" },
                        }),
                    ),
                );
            });

        return () => {
            cancelled = true;
        };
    }, [data.model_class]);

    const handleDownloadClick = (e) => {
        console.log(e);
        e.preventDefault();
        if (originalFilename) {
            window.open(route('imports.download', importDefinition.id), '_blank');
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        patch(
            route('import-definitions.update', {
                import_definition: importDefinition.id
            })
        );
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
                            <InputLabel htmlFor="file">{StringHelper.__("File for import definition")}</InputLabel>
                            <div className="mt-1 flex items-center space-x-2">
                                <button
                                    type="button"
                                    onClick={handleDownloadClick}
                                    className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:bg-gray-500"
                                    title={StringHelper.__("Download file")}
                                    disabled={!originalFilename}
                                >
                                    <FiDownload />
                                    <span className="ml-2">{StringHelper.__("Download")}</span>
                                </button>
                                <TextInput
                                    className="w-full disabled:bg-gray-300"
                                    disabled
                                    readOnly
                                    value={originalFilename}
                                />
                            </div>
                        </div>

                        {data.model_class.length > 0 && <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>}

                        <div className="mt-4">
                            <InputLabel className="mb-2" htmlFor="import_definition_field_mappings">{StringHelper.__("Mappings")}<span className="text-red-500">*</span></InputLabel>
                            <InputError message={errors.field_mappings} className="mb-2" />

                            {data.model_class.length > 0 && (
                                <div id="import_definition_field_mappings">
                                    <PrimaryButton
                                        type="button"
                                        onClick={() => setIsMappingModalOpen(true)}
                                        disabled={importableFields.length === 0}
                                    >
                                        {Object.keys(data.field_mappings).length > 0
                                            ? StringHelper.__("Edit mapping")
                                            : StringHelper.__("Map fields")}
                                    </PrimaryButton>
                                    <div className="mt-4">
                                        <FieldMappingSummary
                                            rawHeaders={rawHeaders}
                                            normalizedHeaders={normalizedHeaders}
                                            fieldMappings={data.field_mappings}
                                            fields={importableFields}
                                        />
                                    </div>
                                    {isMappingModalOpen && (
                                        <Suspense fallback={null}>
                                            <SpreadsheetImportModal
                                                isOpen={isMappingModalOpen}
                                                onClose={() => setIsMappingModalOpen(false)}
                                                fields={importableFields}
                                                rawHeaders={rawHeaders}
                                                normalizedHeaders={normalizedHeaders}
                                                sampleRows={sampleRows}
                                                onMapped={mapping => setData('field_mappings', mapping)}
                                            />
                                        </Suspense>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-2">
                            <Link href={route("import-definitions.index")}
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
