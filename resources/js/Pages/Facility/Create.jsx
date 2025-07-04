import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import InputError from "@/Components/InputError.jsx";
import CreateForm from "@/Components/Forms/CreateForm.jsx";

export default function Create({auth}) {
    const {data, setData, post, errors} = useForm({
        name: '',
    })
    const onSubmit = (e) => {
        e.preventDefault();

        post(route('facilities.store'));
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={<h2
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Create new facility")}</h2>}
        >
            <Head title={StringHelper.__("Create new facility")}/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <CreateForm onSubmit={onSubmit} cancelButtonRoute="facilities.index"
                                    primaryButtonText={StringHelper.__("Create")} cancelButtonText={StringHelper.__("Cancel")}>
                            <div className="mt-4">
                                <InputLabel htmlFor="facility_name">{StringHelper.__("Name")}<span
                                    className="text-red-500">*</span></InputLabel>
                                <TextInput id="facility_name" type="text" name="name" value={data.name}
                                           onChange={e => setData('name', e.target.value)}
                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                <InputError message={errors.name} className="mt-2"/>
                            </div>
                        </CreateForm>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
