import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import Dropdown from "@/Components/Dropdown.jsx";

export default function Edit({ auth, user }) {
    const {data, setData, post, errors} = useForm({
        name: user.data.name || '',
        email: user.data.email || '',
        password: '',
    })

    const onSubmit = (e) => {
        e.preventDefault();

        post(route('users.store'));
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit - {user.data.name}</h2>}
        >
            <Head title="Edit item" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/*<pre> {JSON.stringify(user, undefined, 2)} </pre>*/}
                            <form onSubmit={onSubmit}
                                  className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="user_name"
                                        value="User's name"
                                    />
                                    <TextInput
                                        id="user_name"
                                        type="text"
                                        name="local_name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                </div>
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="user_email"
                                        value="User's email"
                                    />
                                    <TextInput
                                        id="user_email"
                                        type="text"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                    <InputError
                                        message={errors.email} className="mt-2"
                                    />
                                </div>
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="user_password"
                                        value="User's new password"
                                    />
                                    <TextInput
                                        id="user_password"
                                        type="text"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                </div>
                                <div className="mt-4">
                                    <Link href={route('users.index')}
                                          className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
