import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import StringHelper from "@/Libs/StringHelper.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import UnitFormFields from "./UnitFormFields.jsx";

export default function Create({auth}) {
    const {data, setData, post, errors, processing} = useForm({
        code: '',
        name: '',
        decimal_places: 0,
        is_active: true,
    });
    const onSubmit = (e) => {
        e.preventDefault();
        post(route('measurementUnits.store'));
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Create new unit")}</h2>}
        >
            <Head title={StringHelper.__("Create new unit")}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={onSubmit}>
                                <UnitFormFields data={data} setData={setData} errors={errors}/>
                                <div className="mt-4">
                                    <Link href={route('measurementUnits.index')}><SecondaryButton type="button" disabled={processing}>{StringHelper.__("Cancel")}</SecondaryButton></Link>
                                    <PrimaryButton className="ml-2" disabled={processing}>{StringHelper.__("Create")}</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
