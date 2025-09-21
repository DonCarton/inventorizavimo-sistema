import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { FiUpload } from "react-icons/fi";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useRef } from "react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import StringHelper from "@/Libs/StringHelper";
import SteamDropdown from "@/Components/SteamDropdown";
import FieldMappingForm from "@/Components/Forms/FieldMappingForm";
import Checkbox2 from "@/Components/Checkbox2";

export default function Create({ auth, importableObjects }) {
    const [rawHeaders, setRawHeaders] = useState([]);
    const [normalizedHeaders, setNormalizedHeaders] = useState([]);
    const [loadingHeaders, setLoadingHeaders] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [invalidFile, setInvalidFile] = useState(false);
    const fileInputRef = useRef(null);
    const { data, setData, post, errors, processing } = useForm({
        name: "",
        model_class: "",
        file: null,
        field_mappings: {},
        import: true,
    });
    const handleButtonClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };
    const handleModelChange = (e) => {
        const model = e.target.value;
        setData("model_class", model);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        setData("file", file);

        const maxSize = 7.5 * 1024 * 1024;

        if (file.size > maxSize) {
            setInvalidFile(true);
            setSelectedFileName("");
            return;
        }

        setInvalidFile(false);
        setSelectedFileName(file.name);
        setLoadingHeaders(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                route("imports.previewHeaders"),
                formData,
            );

            setRawHeaders(response.data.rawHeaders);
            setNormalizedHeaders(response.data.normalizedHeaders);
        } catch (error) {
            console.error("Failed to preview headers:", error);
        } finally {
            setLoadingHeaders(false);
        }
    };

    const handleCheckbox = (e) => {
        setData("import", e.target.checked);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("import-definitions.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {StringHelper.__("Create new import definition")}
                    </h2>
                </div>
            }
        >
            <Head title={StringHelper.__("Create new import definition")} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form
                        onSubmit={onSubmit}
                        className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                    >
                        <div className="mt-4">
                            <InputLabel htmlFor="import_definition_name">
                                {StringHelper.__("Name")}
                                <span className="text-red-500">*</span>
                            </InputLabel>
                            <TextInput
                                id="import_definition_name"
                                type="text"
                                name="import_definition_name"
                                value={data.name}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="import_definition_model_class">
                                {StringHelper.__("Record type")}
                                <span className="text-red-500">*</span>
                            </InputLabel>
                            <SteamDropdown
                                id="import_definition_model_class"
                                name="import_definition_model_class"
                                value={data.model}
                                disabled={loadingHeaders}
                                onChange={handleModelChange}
                                options={importableObjects}
                                className="mt-1 block w-full disabled:bg-gray-300"
                            />
                            <InputError
                                message={errors.model_class}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="file_upload">
                                {StringHelper.__("File for import definition")}
                                <span className="text-red-500">*</span>
                            </InputLabel>
                            <div className="mt-1 flex items-center space-x-2">
                                <button
                                    id="file_upload"
                                    className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={handleButtonClick}
                                >
                                    <FiUpload className="mr-2" />
                                    <span>{StringHelper.__("Upload")}</span>
                                </button>
                                <TextInput
                                    className="w-full disabled:bg-gray-300"
                                    onClick={handleButtonClick}
                                    disabled
                                    readOnly
                                    value={selectedFileName || ""}
                                />

                                <input
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                    className="w-full"
                                />

                                {invalidFile && (
                                    <p className="text-sm text-red-600 font-medium">
                                        {StringHelper.__("File size", {
                                            maxSize: 8,
                                        })}
                                    </p>
                                )}
                            </div>
                            <InputError
                                className="mt-2"
                                message={errors.file}
                            />
                        </div>

                        {loadingHeaders && (
                            <div className="mt-4 text-sm text-gray-500 dark:text-gray-300 flex items-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-gray-500"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    ></path>
                                </svg>
                                {StringHelper.__("Parsing file")}...
                            </div>
                        )}

                        <div className="mt-4">
                            <InputLabel
                                className="mb-2"
                                htmlFor="import_definition_field_mappings"
                            >
                                {StringHelper.__("Mappings")}
                                <span className="text-red-500">*</span>
                            </InputLabel>
                            <InputError
                                message={errors.field_mappings}
                                className="mb-2"
                            />
                            {normalizedHeaders.length > 0 &&
                                data.model_class.length > 0 && (
                                    <>
                                        <div className="grid grid-cols-2">
                                            <div className="text-xl font-bold">
                                                {StringHelper.__(
                                                    "Field in file",
                                                )}
                                            </div>
                                            <div className="text-xl font-bold">
                                                {StringHelper.__(
                                                    "Field in system",
                                                )}
                                            </div>
                                        </div>
                                        <FieldMappingForm
                                            id="import_definition_field_mappings"
                                            model={data.model_class}
                                            fileHeaders={normalizedHeaders}
                                            rawHeaders={rawHeaders}
                                            value={data.field_mappings}
                                            onChange={(mapping) =>
                                                setData(
                                                    "field_mappings",
                                                    mapping,
                                                )
                                            }
                                        />
                                    </>
                                )}
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="run_import">
                                {StringHelper.__("Run import after creation")}?
                            </InputLabel>
                            <Checkbox2
                                id="run_import"
                                checked={data.import}
                                onChange={handleCheckbox}
                            />
                        </div>
                        <div className="mt-2">
                            <Link
                                href={route("import-definitions.index")}
                                className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                {StringHelper.__("Cancel")}
                            </Link>
                            <PrimaryButton
                                className="ml-2"
                                disabled={processing}
                            >
                                {StringHelper.__("Create")}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
