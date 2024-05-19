import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import {__} from "@/Libs/Lang.jsx";
import ShowForm from "@/Components/Forms/ShowForm.jsx";
import {useState} from "react";

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
                    <ShowForm cancelButtonRoute="laboratories.index" cancelButtonText={__("Cancel")}>
                        <div className="mt-4">
                            <InputLabel htmlFor="user_first_name" value={__("Name")}/>
                            <TextInput id="user_first_name" type="text" name="first_name" value={laboratory.name} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white" readOnly={true} disabled={true}/>
                        </div>
                    </ShowForm>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>);
}
