import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import {__} from "@/Libs/Lang.jsx";
import InputError from "@/Components/InputError.jsx";

export default function Edit({auth, laboratory, role}) {
    const {data, setData, patch, errors} = useForm({
        name: laboratory.name,
    })
    const onSubmit = (e) => {
        e.preventDefault();

        patch(route('laboratories.update', laboratory.id));
    }
    return (<AuthenticatedLayout
        user={auth.user}
        header={<h2
            className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Edit")} - {laboratory.name}</h2>}
        role={role}
    >
        <Head title={__("Edit") + " - " + laboratory.name}/>

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="mt-4">
                            <InputLabel htmlFor="laboratory_name">{__("Name")}<span className="text-red-500">*</span></InputLabel>
                            <TextInput id="laboratory_name" type="text" name="name" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                            <InputError message={errors.name} className="mt-2"/>
                        </div>
                        <div className="mt-4">
                            <Link href={route('laboratories.index')}
                                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">
                                {__("Cancel")}
                            </Link>
                            <button
                                className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                                {__("Save")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>);
}
