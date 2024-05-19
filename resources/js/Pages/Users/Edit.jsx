import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import {__} from "@/Libs/Lang.jsx";
import {Capitalize} from "@/Libs/Capitalize.jsx";
import {useState} from "react";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function Edit({auth, user, role, userRole, roles, laboratories, previousUrl}) {
    const [previousUrlPage] = useState(previousUrl);
    const {data, setData, put, errors, processing} = useForm({
        first_name: user.data.first_name || '',
        last_name: user.data.last_name || '',
        email: user.data.email || '',
        laboratory: user.data.laboratory,
        role: userRole[0].name,
    })
    const onSubmit = (e) => {
        e.preventDefault();

        put(route('users.update', user.data.id));
    }
    return (<AuthenticatedLayout
            user={auth.user}
            header={<h2
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Edit")} - {user.data.email}</h2>}
            role={role}
        >
            <Head title={__("Edit") + " - " + user.data.email}/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="mt-4">
                                <InputLabel htmlFor="user_first_name">{__("First name")}<span className="text-red-500">*</span></InputLabel>
                                <TextInput id="user_first_name" type="text" name="first_name" value={data.first_name}
                                           className="mt-1 block w-full"
                                           onChange={e => setData('first_name', e.target.value)}/>
                                <InputError message={errors.first_name} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="user_last_name">{__("Last name")}<span className="text-red-500">*</span></InputLabel>
                            <TextInput id="user_last_name" type="text" name="last_name" value={data.last_name}
                                           className="mt-1 block w-full"
                                           onChange={e => setData('last_name', e.target.value)}/>
                                <InputError message={errors.last_name} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="user_email">{__("Email")}<span
                                    className="text-red-500">*</span></InputLabel>
                                <TextInput id="user_email" type="email" name="email" value={data.email}
                                           className="mt-1 block w-full"
                                           onChange={e => setData('email', e.target.value)}/>
                                <InputError message={errors.email} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="user_laboratory">{__("Laboratory")}<span
                                    className="text-red-500">*</span></InputLabel>
                                <select id="user_laboratory" name="laboratory"
                                        className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                                        value={data.laboratory} onChange={e => setData('laboratory', e.target.value)}>
                                    <option value="">{__("Choose a value")}</option>
                                    {laboratories.map((laboratory) => (
                                        <option key={laboratory.id} value={laboratory.id}>{laboratory.name}</option>))}
                                </select>
                                <InputError message={errors.laboratory} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="user_role">{__("Role")}<span className="text-red-500">*</span></InputLabel>
                                <select id="user_role" name="role"
                                        className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                                        value={data.role} onChange={e => setData('role', e.target.value)}>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.name}>{Capitalize(role.name)}</option>))}
                                </select>
                                <InputError message={errors.role} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <Link href={previousUrlPage}
                                      className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    {__("Cancel")}
                                </Link>
                                <PrimaryButton className="ml-2" disabled={processing}>{__("Save")}</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    </AuthenticatedLayout>);
}
