import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import {__} from "@/Libs/Lang.jsx";
import InputError from "@/Components/InputError.jsx";
import CreateForm from "@/Components/Forms/CreateForm.jsx";
import {useState} from "react";

export default function Create({auth, role, previousUrl}) {
    const [previousUrlPage] = useState(previousUrl);
    const {data, setData, post, errors} = useForm({
        name: '',
    })
    const onSubmit = (e) => {
        e.preventDefault();

        post(route('laboratories.store'));
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Create new laboratory")}</h2>}
            role={role}
        >
            <Head title={__("Create new laboratory")}/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <CreateForm onSubmit={onSubmit} cancelButtonRoute="laboratories.index"
                                    primaryButtonText={__("Create")} cancelButtonText={__("Cancel")}>
                            <div className="mt-4">
                                <InputLabel htmlFor="laboratory_name">{__("Name")}<span
                                    className="text-red-500">*</span></InputLabel>
                                <TextInput id="laboratory_name" type="text" name="name" value={data.name}
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
