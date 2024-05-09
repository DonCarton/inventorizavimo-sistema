import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import {__} from "@/Libs/Lang.jsx";

export default function Edit({auth, user}) {
    const {data, setData, post, errors} = useForm({
        first_name: user.data.first_name || '',
        last_name: user.data.first_name || '',
        email: user.data.email || '',
        password: '',
        laboratory: user.data.laboratory || '',
    })
    const onSubmit = (e) => {
        e.preventDefault();

        post(route('users.store'));
    }
    return (<AuthenticatedLayout
            user={auth.user}
            header={<h2
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Edit")} - {user.data.name}</h2>}
        >
            <Head title={__("Edit") + " - " + user.data.email}/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {/*<pre> {JSON.stringify(user, undefined, 2)} </pre>*/}
                        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="mt-4">
                                <InputLabel htmlFor="user_first_name" value={__("First name")}/>
                                <TextInput id="user_first_name" type="text" name="first_name" value={data.first_name}
                                           className="mt-1 block w-full"
                                           onChange={e => setData('first_name', e.target.value)}/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="user_last_name" value={__("Last name")}/>
                                <TextInput id="user_last_name" type="text" name="last_name" value={data.last_name}
                                           className="mt-1 block w-full"
                                           onChange={e => setData('last_name', e.target.value)}/>
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
                                <TextInput id="user_laboratory" type="text" name="laboratory" value={data.laboratory}
                                           className="mt-1 block w-full"
                                           onChange={e => setData('laboratory', e.target.value)}/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="user_password" value={__("Password")}/>
                                <TextInput id="user_password" type="password" name="password" value={data.password}
                                           className="mt-1 block w-full"
                                           onChange={e => setData('password', e.target.value)}/>
                            </div>
                            <div className="mt-4">
                                <Link href={route('users.index')}
                                      className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">
                                    {__("Cancel")}
                                </Link>
                                <button
                                    className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                                    {__("Save")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>);
}
