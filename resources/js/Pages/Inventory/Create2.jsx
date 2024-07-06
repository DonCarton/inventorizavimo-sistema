import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, useForm} from "@inertiajs/react";
import {__} from "@/Libs/Lang.jsx";
import FlexibleSelect from "@/Components/Forms/FlexibleSelect.jsx";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import InputError from "@/Components/InputError.jsx";

export default function Create2({auth, previousUrl, role, laboratories, itemTypes}) {
    const {data, formData, setData, post, processing, errors} = useForm({
        local_name: '',
        inventory_type: null,
        name: '',
        laboratory: null
    });
    const handleTypeChange = (e) => {
        setData('inventory_type', e);
    }
    const handleLaboratoryChange = (e) => {
        setData('laboratory', e);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('inventoryItems.store'));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Create new inventory item")}</h2>
                </div>
            }
            role={role}
        >
            <Head title={__("Create new inventory item")}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-y-visible shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="inventoryItems_itemType" className="mb-1">
                                        {__("Type")}<span className="text-red-500">*</span>
                                    </InputLabel>
                                    <FlexibleSelect
                                        customPlaceHolder="Pasirinkti tipą"
                                        value={data.inventory_type}
                                        onChange={handleTypeChange}
                                        fetchUrlPath="/select/itemTypes"
                                        customNoOptionsMessage={__("No item types found")}
                                        customLoadingMessage={__("Fetching options") + "..."}
                                        customIsMulti={true} // Example of customIsMulti usage
                                    />
                                    <InputError message={errors.inventory_type} className="mt-2"/>
                                </div>
                                <div>
                                    <InputLabel htmlFor="inventoryItems_name" className="mb-1">
                                        {__("Laboratory")} <span className="text-red-500">*</span>
                                    </InputLabel>
                                    <FlexibleSelect
                                        customPlaceHolder="Pasirinkti laboratorija"
                                        value={data.laboratory}
                                        onChange={handleLaboratoryChange}
                                        fetchUrlPath="/select/laboratories"
                                        customNoOptionsMessage={__("No laboratories found")}
                                        customLoadingMessage={__("Fetching options") + "..."}
                                    />
                                    <InputError message={errors.laboratory} className="mt-2"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
