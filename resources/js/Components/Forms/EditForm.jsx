import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {Link} from "@inertiajs/react";

export default function EditForm({children, onSubmit, cancelButtonRoute, primaryButtonText, cancelButtonText})  {
    return(
        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            {children}
            <div className="mt-4">
                <Link href={route(cancelButtonRoute)} className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150 mr-2">{cancelButtonText}</Link>
                <PrimaryButton>{primaryButtonText}</PrimaryButton>
            </div>
        </form>
    )
}
