import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import ShowForm from "@/Components/Forms/ShowForm.jsx";
import HistoryLog from "@/Components/Forms/HistoryLog.jsx";

export default function Show({auth, laboratory, role}) {
    return (<AuthenticatedLayout
        user={auth.user}
        header={
            <div className="flex justify-between items-center"><h2
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Show")} - {laboratory.name}</h2>
                <div className="flex space-x-2 h-12">
                    <HistoryLog objectId={laboratory.id} objectType="laboratory" nameOfButton={StringHelper.__("History")}
                                nameOfCloseButton={StringHelper.__("Close")}/>
                </div>
            </div>}
        role={role}
    >
        <Head title={StringHelper.__("Show") + " - " + laboratory.name}/>

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <ShowForm cancelButtonRoute="laboratories.index" cancelButtonText={StringHelper.__("Cancel")}>
                        <div className="mt-4">
                            <InputLabel htmlFor="user_first_name" value={StringHelper.__("Name")}/>
                            <TextInput id="user_first_name" type="text" name="first_name" value={laboratory.name} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white" readOnly={true} disabled={true}/>
                        </div>
                    </ShowForm>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>);
}
