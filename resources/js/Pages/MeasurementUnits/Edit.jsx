import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import StringHelper from "@/Libs/StringHelper.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import DeleteButton from "@/Components/Forms/DeleteButton.jsx";
import UnitFormFields from "./UnitFormFields.jsx";

export default function Edit({auth, measurementUnit, can}) {
    const unit = measurementUnit.data;
    const handleConfirmMessage = StringHelper.__("Are you sure you want to delete this item") + '?';
    const {data, setData, put, delete: destroy, errors, processing} = useForm({
        code: unit.code || '',
        name: unit.name || '',
        decimal_places: unit.decimalPlaces ?? 0,
        is_active: unit.isActive ?? true,
    });
    const codeChanged = data.code !== unit.code;
    const onSubmit = (e) => {
        e.preventDefault();
        put(route('measurementUnits.update', unit.id));
    };
    const handleDestroy = () => {
        if (window.confirm(handleConfirmMessage)) {
            destroy(route('measurementUnits.destroy', unit.id), {preserveScroll: true});
        }
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Edit")} - {unit.code}</h2>}
        >
            <Head title={StringHelper.__("Edit") + " - " + unit.code}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={onSubmit}>
                                <UnitFormFields data={data} setData={setData} errors={errors}/>
                                {codeChanged && unit.itemCount > 0 && (
                                    <div className="mt-4 p-3 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200 text-sm">
                                        {StringHelper.__("Existing item codes (:count) keep the old code :old, only new items get :new", {
                                            count: unit.itemCount,
                                            old: unit.code,
                                            new: data.code || '-',
                                        })}.
                                    </div>
                                )}
                                <div className="flex justify-between mt-4">
                                    <div>
                                        <Link href={route('measurementUnits.index')}><SecondaryButton type="button" disabled={processing}>{StringHelper.__("Cancel")}</SecondaryButton></Link>
                                        <PrimaryButton className="ml-2" disabled={processing}>{StringHelper.__("Save")}</PrimaryButton>
                                    </div>
                                    {can.delete && <DeleteButton disabled={processing} type="button" onClick={handleDestroy}>{StringHelper.__("Delete")}</DeleteButton>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
