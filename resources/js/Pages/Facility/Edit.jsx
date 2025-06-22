import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import InputError from "@/Components/InputError.jsx";
import EditForm from "@/Components/Forms/EditForm.jsx";
import axios from "axios";

export default function Edit({ auth, facility, can }) {
    const handleConfirmMessage = StringHelper.__("Are you sure you want to delete this item") + '?';
    const handleSecondConfirm = StringHelper.__("Secondary confirm");
    const { data, setData, patch, delete: destroy, errors, processing } = useForm({
        name: facility.name,
    })
    const onSubmit = (e) => {
        e.preventDefault();

        patch(route('facilities.update', facility.id));
    }
    const handleDestroy = (value) => {
        if (!window.confirm(handleConfirmMessage)) { return; }

        axios.get(route('facilities.delete-impact', facility.id))
            .then(response => {
                const { impactCounts } = response.data;
                const totalImpact = Object.values(impactCounts).reduce((sum, count) => sum + count, 0);

                if (totalImpact === 0) {
                    destroy(route('facilities.destroy', value), {
                        preserveScroll: true
                    });
                } else {

                    const list = StringHelper.HumanizeImpactList(response.data.impactCounts, response.data.labels);

                    const msg = handleSecondConfirm.replace(':impactList', list);

                    if (window.confirm(msg)) {
                        destroy(route('facilities.destroy', value), {
                            preserveScroll: true
                        });
                    };
                }
            });
    };
    return (<AuthenticatedLayout
        user={auth.user}
        can={auth.can}
        header={<h2
            className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Edit")} - {facility.name}</h2>}
    >
        <Head title={StringHelper.__("Edit") + " - " + facility.name} />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <EditForm disabled={processing} cancelButtonRoute="facilities.index" cancelButtonText={StringHelper.__("Cancel")}
                        primaryButtonText={StringHelper.__("Save")} onSubmit={onSubmit} deleteButtonText={StringHelper.__("Delete")}
                        deleteButtonOnClick={() => handleDestroy(facility.id)} canDelete={can.delete}>
                        <div className="mt-4">
                            <InputLabel htmlFor="facility_name">{StringHelper.__("Name")}<span
                                className="text-red-500">*</span></InputLabel>
                            <TextInput id="facility_name" type="text" name="name" value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white" />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                    </EditForm>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>);
}
