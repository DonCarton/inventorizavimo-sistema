import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import {__} from "@/Libs/Lang.jsx";
import {Capitalize} from "@/Libs/Capitalize.jsx";

export default function Show({auth, user, role, userRole, roles, laboratories}) {
    return (<AuthenticatedLayout
            user={auth.user}
            header={<h2
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Show")} - {user.data.email}</h2>}
            role={role}
        >
            <Head title={__("Show") + " - " + user.data.email}/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="mt-4">
                                <InputLabel htmlFor="user_first_name" value={__("First name")}/>
                                <TextInput id="user_first_name" type="text" name="first_name" value={user.data.first_name} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white" readOnly={true} disabled={true}/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="user_last_name" value={__("Last name")}/>
                                <TextInput id="user_last_name" type="text" name="last_name" value={user.data.last_name} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white" readOnly={true} disabled={true}/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="user_email" value={__("Email")}/>
                                <TextInput id="user_email" type="email" name="email" value={user.data.email} className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white" readOnly={true} disabled={true}/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="user_laboratory" value={__("Laboratory")}/>
                                <select disabled={true} className="disabled:bg-gray-400 disabled:text-white border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full" value={user.data.laboratory}>
                                    <option>{__("Choose a value")}</option>
                                    {laboratories.map((laboratory) => (<option key={laboratory.id} value={laboratory.id}>{laboratory.name}</option>))}
                                </select>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="user_role" value={__("Role")}/>
                                <select id="user_role" name="role" disabled={true} className="disabled:bg-gray-400 disabled:text-white border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full" value={userRole[0].name}>
                                    <option>{__("Choose a value")}</option>
                                    {roles.map((role) => (<option key={role.id} value={role.name}>{Capitalize(role.name)}</option>))}
                                </select>
                            </div>
                            <div className="mt-4">
                                <Link href={route('users.index')} className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"> {__("Cancel")}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>);
}
