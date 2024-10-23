import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {Link} from "@inertiajs/react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import {RiDeleteBin6Line} from "react-icons/ri";
import React from "react";

export default function EditForm({children, onSubmit, cancelButtonRoute, primaryButtonText, cancelButtonText, deleteButtonOnClick, deleteButtonText})  {
    return(
        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            {children}
            <div className="flex justify-between mt-4">
                <div>
                    <Link href={route(cancelButtonRoute)}><SecondaryButton type="button"
                                                                           className="mr-2">{cancelButtonText}</SecondaryButton></Link>
                    <PrimaryButton>{primaryButtonText}</PrimaryButton>
                </div>
                <button type="button" onClick={deleteButtonOnClick}
                   className="inline-flex items-center px-4 py-2 bg-pink-500 dark:bg-pink-500 border border-pink-500 hover:border-pink-800 dark:border-pink-500 rounded-md font-semibold text-xs text-white dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-rose-800 dark:hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150">{deleteButtonText}<RiDeleteBin6Line className="ml-1 w-5 h-5 text-white"/>
                </button>
            </div>
        </form>
    )
}
