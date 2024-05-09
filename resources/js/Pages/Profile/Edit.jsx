import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import {Head, useForm} from '@inertiajs/react';
import SteamDropdown from "@/Components/SteamDropdown.jsx";

export default function Edit({auth, mustVerifyEmail, status}) {

    //const setLanguage = 'English';

    const options = [
        { id: 'en', name: 'en' },
        { id: 'lt', name: 'lt' },
    ];
    const {data, setData, post, errors} = useForm({
        selectedLanguage: '',
    });
    const onSubmit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Profile</h2>}
        >
            <Head title="Profile"/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <form onSubmit={onSubmit}>
                            <SteamDropdown
                                name="languages"
                                onChange={e => setData('selectedLanguage', e.target.value)}
                                options={options}
                                className="max-w-xl"
                            />
                            {/*<div className="flex items-center gap-4">*/}
                            {/*    <PrimaryButton className="mt-4" disabled={false}>Save</PrimaryButton>*/}
                            {/*</div>*/}
                            <div className="flex items-center gap-4">
                                <button
                                    className="mt-4">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl"/>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
