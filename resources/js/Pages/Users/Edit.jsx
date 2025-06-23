import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import SteamDropdown from "@/Components/SteamDropdown";
import FailureMessage from "@/Components/FailureMessage.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import DeleteButton from "@/Components/Forms/DeleteButton.jsx";
import FlexibleStaticSelect from "@/Components/Forms/FlexibleStaticSelect";
import { useEffect, useState } from "react";

export default function Edit({ auth, user, userRole, roles, laboratories, facilities, flash, can }) {
    const handleConfirmMessage = StringHelper.__("Are you sure you want to delete this item") + '?';
    const { data, setData, put, delete: destroy, errors, processing } = useForm({
        first_name: user.data.first_name || '',
        last_name: user.data.last_name || '',
        email: user.data.email || '',
        laboratory: user.data.laboratory,
        role: userRole,
    })
    const [willedFacility, setWilledFacility] = useState(facilities[data.laboratory] || []);
    const [mappedFacility, setMappedFacility] = useState(user.data.facility || []);
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

        put(route('users.update', user.data.id));
    }
    const handleDestroy = (value) => {
        if (window.confirm(handleConfirmMessage)) {
            destroy(route('users.destroy', value), {
                preserveScroll: true
            });
        }
    }
    return (<AuthenticatedLayout
        user={auth.user}
        can={auth.can}
        header={<h2
            className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Edit")} - {user.data.email}</h2>}
    >
        <Head title={StringHelper.__("Edit") + " - " + user.data.email} />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {flash.failure && <FailureMessage message={flash.failure} />}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
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
                            <InputLabel htmlFor="user_email">{StringHelper.__("Email")}<span
                                className="text-red-500">*</span></InputLabel>
                            <TextInput id="user_email" type="email" name="email" value={data.email}
                                className="mt-1 block w-full"
                                onChange={e => setData('email', e.target.value)} />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="user_laboratory">{StringHelper.__("Laboratory")}<span
                                className="text-red-500">*</span></InputLabel>
                            <select id="user_laboratory" name="laboratory"
                                className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                                value={data.laboratory} onChange={e => setData('laboratory', e.target.value)}>
                                <option value="">{StringHelper.__("Choose a value")}</option>
                                {laboratories.map((laboratory) => (
                                    <option key={laboratory.id} value={laboratory.id}>{laboratory.name}</option>))}
                            </select>
                            <InputError message={errors.laboratory} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="user_facility">{StringHelper.__("Facility")}</InputLabel>
                            <FlexibleStaticSelect id="user_facility" value={mappedFacility} customIsDisabled={true} options={willedFacility}
                                customIsMulti={true} customPlaceHolder="" customNoOptionsMessage={StringHelper.__("No options")} />
                            <InputError message={errors.facility} className="mt-2"/>
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="user_role">{StringHelper.__("Role")}<span className="text-red-500">*</span></InputLabel>
                            <SteamDropdown required disabled={user.data.id === auth.user.id} name="inventory_type_query_select" className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white" value={data.role} options={roles.data} onChange={e => setData('role', e.target.value)} />
                            <InputError message={errors.role} className="mt-2" />
                        </div>
                        <div className="flex justify-between mt-4">
                            <div>
                                <Link href="/users"><SecondaryButton type="button" disabled={processing}>{StringHelper.__("Cancel")}</SecondaryButton></Link>
                                <PrimaryButton className="ml-2" disabled={processing}>{StringHelper.__("Save")}</PrimaryButton>
                            </div>
                            {can.deleteUser && <DeleteButton type="button" disabled={processing} onClick={() => handleDestroy(user.data.id)}>{StringHelper.__("Delete")}</DeleteButton>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>);
}
