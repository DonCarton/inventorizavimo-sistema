import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';
import UpdateConfiguration from './Partials/UpdateConfiguration';
import FailureMessage from '@/Components/FailureMessage';

export default function Edit({ auth, systemConfiguration, myConfigurations, flash }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">System configurations</h2>}
        >
            <Head title="System configurations"/>

            <div className="py-12">
                {flash.failure && <FailureMessage message={flash.failure}/>}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* {systemConfiguration.email && <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <UpdateConfiguration configurations={systemConfiguration.email} sectionName="Email configurations"/>
                    </div>}

                    {systemConfiguration.users && <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <UpdateConfiguration configurations={systemConfiguration.users} sectionName="User configurations"/>
                    </div>}

                    {systemConfiguration.general && <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <UpdateConfiguration configurations={systemConfiguration.general} sectionName="General configurations"/>
                    </div>} */}
                    <div>
                        {Object.keys(myConfigurations).map((category) => (
                            <div key={category} className="mt-2">
                                <h2 className="font-bold">{category.charAt(0).toUpperCase() + category.slice(1)} Configurations</h2>
                                <ul>
                                    {myConfigurations[category].map((config) => (
                                        <li key={config.id}>
                                            {config.name}: {config.value.value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
