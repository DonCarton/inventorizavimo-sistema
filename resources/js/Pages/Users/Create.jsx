import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import SteamDropdown from "@/Components/SteamDropdown.jsx"
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import StringHelper from "@/Libs/StringHelper";
import FlexibleStaticSelect from "@/Components/Forms/FlexibleStaticSelect";
import { useEffect, useState } from "react";

export default function Create({ auth, roles, laboratories, facilities }) {
    const [willedFacility, setWilledFacility] = useState([]);
    const [mappedFacility, setMappedFacility] = useState([]);
    const { data, setData, post, errors, processing } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        laboratory: '',
        selectedRole: '',
    });
    useEffect(() => {
        setWilledFacility(facilities[data.laboratory]);
        let values = [];
        if (data.laboratory !== '') {
            facilities[data.laboratory].forEach(facility => {
                values.push(facility.value);
            });
        }
        setMappedFacility(values);
    }, [data.laboratory]);

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Create new user")}</h2>
                </div>
            }
        >
            <Head title={StringHelper.__("Create new user")} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="mt-4">
                            <InputLabel htmlFor="user_first_name">{StringHelper.__("First name")}<span className="text-red-500">*</span></InputLabel>
                            <TextInput id="user_first_name" type="text" name="first_name" value={data.first_name}
                                className="mt-1 block w-full"
                                onChange={e => setData('first_name', e.target.value)} />
                            <InputError message={errors.first_name} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="user_last_name">{StringHelper.__("Last name")}<span className="text-red-500">*</span></InputLabel>
                            <TextInput id="user_last_name" type="text" name="last_name" value={data.last_name}
                                className="mt-1 block w-full"
                                onChange={e => setData('last_name', e.target.value)} />
                            <InputError message={errors.last_name} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="user_email">{StringHelper.__("Email")}<span className="text-red-500">*</span></InputLabel>
                            <TextInput id="user_email" type="text" name="email" value={data.email}
                                className="mt-1 block w-full"
                                onChange={e => setData('email', e.target.value)} />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="user_laboratory">{StringHelper.__("Laboratory")}<span className="text-red-500">*</span></InputLabel>
                            <select className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full" value={data.laboratory} onChange={e => setData('laboratory', e.target.value)}>
                                <option value="">{StringHelper.__("Choose a value")}</option>
                                {laboratories.data.map((laboratory) => (<option key={laboratory.value} value={laboratory.value}>{laboratory.label}</option>))}
                            </select>
                            <InputError message={errors.laboratory} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="user_facility">{StringHelper.__("Facility")}</InputLabel>
                            <FlexibleStaticSelect id="user_facility" value={mappedFacility} customIsDisabled={true} options={willedFacility}
                                customIsMulti={true} customPlaceHolder="" customNoOptionsMessage={StringHelper.__("No options")} />
                            <InputError message={errors.facility} className="mt-2" />
                        </div>
                        <div className="mt-4 mb-2">
                            <InputLabel
                                htmlFor="user_role">{StringHelper.__("Role")}<span className="text-red-500">*</span></InputLabel>
                            <div>
                                <SteamDropdown
                                    name="roles"
                                    value={data.selectedRole}
                                    onChange={e => setData('selectedRole', e.target.value)}
                                    options={roles.data}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <InputError message={errors.selectedRole} className="mt-2" />
                        </div>
                        <div className="mt-2">
                            <Link href={route("users.index")}
                                className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                {StringHelper.__("Cancel")}
                            </Link>
                            <PrimaryButton className="ml-2" disabled={processing}>{StringHelper.__("Create")}</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
