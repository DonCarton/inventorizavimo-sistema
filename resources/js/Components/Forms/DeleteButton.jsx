import {RiDeleteBin6Line} from "react-icons/ri";
import React from "react";

export default function DeleteButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className="inline-flex items-center px-4 py-2 bg-pink-500 dark:bg-pink-500 border border-pink-500 hover:border-pink-800 dark:border-pink-500 rounded-md font-semibold text-xs text-white dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-rose-800 dark:hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
            disabled={disabled}
        >
            {children}
            <RiDeleteBin6Line className="ml-1 w-4 h-4 text-white"/>
        </button>
    );
}
