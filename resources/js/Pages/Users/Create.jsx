import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import {__} from "@/Libs/Lang.jsx";
import SteamDropdown from "@/Components/SteamDropdown.jsx"
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {useState} from "react";

export default function Create({auth, roles, role, laboratories, previousUrl}) {
    const [previousUrlPage] = useState(previousUrl);

    const {data, setData, post, errors, processing} = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        laboratory: '',
        selectedRole: '',
    });
    const onSubmit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Create new user")}</h2>
                </div>
            }
            role={role}
        >
            <Head title={__("Create new user")}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="mt-4">
                            <InputLabel htmlFor="user_first_name" value={__("First name")}/>
                            <TextInput id="user_first_name" type="text" name="first_name" value={data.first_name}
                                       className="mt-1 block w-full"
                                       onChange={e => setData('first_name', e.target.value)}/>
                            <InputError message={errors.first_name} className="mt-2"/>
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="user_last_name" value={__("Last name")}/>
                            <TextInput id="user_last_name" type="text" name="last_name" value={data.last_name}
                                       className="mt-1 block w-full"
                                       onChange={e => setData('last_name', e.target.value)}/>
                            <InputError message={errors.last_name} className="mt-2"/>
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="user_email" value={__("Email")}/>
                            <TextInput id="user_email" type="text" name="email" value={data.email}
                                       className="mt-1 block w-full"
                                       onChange={e => setData('email', e.target.value)}/>
                            <InputError message={errors.email} className="mt-2"/>
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="user_laboratory" value={__("Laboratory")}/>
                            <select className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full" value={data.laboratory} onChange={e => setData('laboratory', e.target.value)}>
                                <option value="">{__("Choose a value")}</option>
                                {laboratories.data.map((laboratory) => (<option key={laboratory.value} value={laboratory.value}>{laboratory.label}</option>))}
                            </select>
                            <InputError message={errors.laboratory} className="mt-2"/>
                        </div>
                        <div className="mt-4 mb-2">
                            <InputLabel
                                htmlFor="user_role"
                                value={__("Role")}
                            />
                            <div>
                            <SteamDropdown
                                    name="roles"
                                    value={data.selectedRole}
                                    onChange={e => setData('selectedRole', e.target.value)}
                                    options={roles}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <InputError message={errors.selectedRole} className="mt-2"/>
                        </div>
                        <div className="mt-2">
                            <Link href={previousUrlPage}
                                  className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                {__("Cancel")}
                            </Link>
                            <PrimaryButton className="ml-2" disabled={processing}>{__("Create")}</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
