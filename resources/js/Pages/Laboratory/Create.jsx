import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import InputError from "@/Components/InputError.jsx";
import CreateForm from "@/Components/Forms/CreateForm.jsx";
import FlexibleStaticSelect from "@/Components/Forms/FlexibleStaticSelect";

export default function Create({auth,facilities}) {
    const {data, setData, post, errors} = useForm({
        name: '',
        ident_code: '',
        facility: [],
    })

    const handleFacilityChange = (e) => {
        setData('facility', e);
    };
    
    const onSubmit = (e) => {
        e.preventDefault();

        post(route('laboratories.store'));
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={<h2
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Create new laboratory")}</h2>}
        >
            <Head title={StringHelper.__("Create new laboratory")}/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <CreateForm onSubmit={onSubmit} cancelButtonRoute="laboratories.index"
                                    primaryButtonText={StringHelper.__("Create")} cancelButtonText={StringHelper.__("Cancel")}>
                            <div className="mt-4">
                                <InputLabel htmlFor="laboratory_name">{StringHelper.__("Name")}<span
                                    className="text-red-500">*</span></InputLabel>
                                <TextInput id="laboratory_name" type="text" name="name" value={data.name}
                                           onChange={e => setData('name', e.target.value)}
                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                <InputError message={errors.name} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="laboratory_ident_code">{StringHelper.__("Identification code")}<span
                                    className="text-red-500">*</span></InputLabel>
                                <TextInput id="laboratory_ident_code" type="text" name="laboratory_ident_code" value={data.ident_code}
                                           onChange={e => setData('ident_code', e.target.value)}
                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                <InputError message={errors.ident_code} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="laboratory_facility">{StringHelper.__("Facility")}</InputLabel>
                                <FlexibleStaticSelect id="laboratory_facility" value={data.facility} onChange={handleFacilityChange} options={facilities}
                                    customIsMulti={true} customPlaceHolder={StringHelper.__("Choose a facility")} customNoOptionsMessage={StringHelper.__("No options")}/>
                                <InputError message={errors.facility} className="mt-2"/>
                            </div>
                        </CreateForm>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
