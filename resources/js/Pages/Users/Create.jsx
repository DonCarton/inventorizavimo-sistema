import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import {__} from "@/Libs/Lang.jsx";
import SteamDropdown from "@/Components/SteamDropdown.jsx"

export default function Create({auth, roles, role}) {

    const {data, setData, post, errors} = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        laboratory: '',
        selectedRole: '',
    });
    const prefixOptions = [
        {value: '1', label: 'BIO'},
        {value: '2', label: 'CHE'},
        {value: '3', label: 'FIZ'},
        {value: '4', label: 'FAB'},
        {value: '5', label: 'PRO'},
        {value: '6', label: 'ROB'},
        {value: '7', label: 'SVI'},
        {value: '8', label: 'INZ'},
        {value: '9', label: 'BEN'},
    ];

    console.log(data.laboratory);

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
                                {prefixOptions.map((prefixOption) => (<option key={prefixOption.value} value={prefixOption.value}>{prefixOption.label}</option>))}
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
                            <Link href={route('users.index')}
                                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                            >
                                {__("Cancel")}
                            </Link>
                            <button
                                className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                                {__("Create")}
                            </button>
                        </div>
                    </form>
                    {/*</div>*/}
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
