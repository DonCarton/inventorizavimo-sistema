import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';
import UpdateEmailConfigurations from './Partials/UpdateEmailConfigurations';
import FailureMessage from '@/Components/FailureMessage';

export default function Edit({ auth, role, systemConfiguration, flash }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Profile</h2>}
            role={role}
        >
            <Head title="Profile"/>

            <div className="py-12">
            {flash.failure && <FailureMessage message={flash.failure}/>}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <UpdateEmailConfigurations configurations={systemConfiguration.email}/>
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <pre>{JSON.stringify(systemConfiguration, undefined, 2)}</pre>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
