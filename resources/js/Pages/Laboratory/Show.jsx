import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import ShowForm from "@/Components/Forms/ShowForm.jsx";
import HistoryLog from "@/Components/Forms/HistoryLog.jsx";

export default function Show({auth, laboratory}) {
    return (<AuthenticatedLayout
        user={auth.user}
        can={auth.can}
        header={
            <div className="flex justify-between items-center"><h2
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Show")} - {laboratory.name}</h2>
                <div className="flex space-x-2 h-12">
                    <HistoryLog objectId={laboratory.id} objectType="laboratory" nameOfButton={StringHelper.__("History")}
                                nameOfCloseButton={StringHelper.__("Close")}/>
                </div>
            </div>}
    >
        <Head title={StringHelper.__("Show") + " - " + laboratory.name}/>

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <ShowForm cancelButtonRoute="laboratories.index" cancelButtonText={StringHelper.__("Cancel")}>
                        <div className="mt-4">
                            <InputLabel htmlFor="laboratory_name" value={StringHelper.__("Name")}/>
                            <TextInput id="laboratory_name" type="text" name="laboratory_name" value={laboratory.name} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white" readOnly={true} disabled={true}/>
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="laboratory_ident_code" value={StringHelper.__("Identification code")}/>
                            <TextInput id="laboratory_ident_code" type="text" name="laboratory_ident_code" value={laboratory.ident_code} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white" readOnly={true} disabled={true}/>
                        </div>
                    </ShowForm>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>);
}
