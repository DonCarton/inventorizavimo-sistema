import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import InputError from "@/Components/InputError.jsx";
import EditForm from "@/Components/Forms/EditForm.jsx";

export default function Edit({auth, laboratory}) {
    const {data, setData, patch, errors} = useForm({
        name: laboratory.name,
    })
    const onSubmit = (e) => {
        e.preventDefault();

        patch(route('laboratories.update', laboratory.id));
    }
    return (<AuthenticatedLayout
        user={auth.user}
        can={auth.can}
        header={<h2
            className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Edit")} - {laboratory.name}</h2>}
    >
        <Head title={StringHelper.__("Edit") + " - " + laboratory.name}/>

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <EditForm cancelButtonRoute="laboratories.index" cancelButtonText={StringHelper.__("Cancel")} primaryButtonText={StringHelper.__("Save")} onSubmit={onSubmit} >
                        <div className="mt-4">
                            <InputLabel htmlFor="laboratory_name">{StringHelper.__("Name")}<span
                                className="text-red-500">*</span></InputLabel>
                            <TextInput id="laboratory_name" type="text" name="name" value={data.name}
                                       onChange={e => setData('name', e.target.value)}
                                       className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                            <InputError message={errors.name} className="mt-2"/>
                        </div>
                    </EditForm>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>);
}
