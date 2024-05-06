import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Accordion, Button} from '@material-tailwind/react';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">You're logged in { auth.user.name }!</div>
                        <Button className="mt-4 text-gray-900 bg-blue-500">Spustelk mane</Button>
                        <Accordion></Accordion>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
