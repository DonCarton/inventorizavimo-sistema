import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import {__} from "@/Libs/Lang.jsx";

export default function Show({auth, laboratory, role}) {
    return (<AuthenticatedLayout
        user={auth.user}
        header={<h2
            className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Show")} - {laboratory.name}</h2>}
        role={role}
    >
        <Head title={__("Show") + " - " + laboratory.name}/>

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="mt-4">
                            <InputLabel htmlFor="user_first_name" value={__("Name")}/>
                            <TextInput id="user_first_name" type="text" name="first_name" value={laboratory.name} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white" readOnly={true} disabled={true}/>
                        </div>
                        <div className="mt-4">
                            <Link href={route('laboratories.index')} className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"> {__("Cancel")}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>);
}
