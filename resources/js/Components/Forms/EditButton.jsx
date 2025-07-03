import { TbEdit } from "react-icons/tb";
import React from "react";
import { Link } from "@inertiajs/react";

export default function EditButton({ href, className = '', disabled, children, ...props }) {
    return (
        <Link {...props} href={href} disabled={disabled}
            className="inline-flex items-center px-4 py-2 bg-green-500 dark:bg-green-400 border border-green-500 hover:border-green-800 dark:border-green-500 rounded-md font-semibold text-xs text-white dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-emerald-800 dark:hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
            >
            {children}
            <TbEdit className="ml-1 w-4 h-4 text-white"/>
        </Link>
    );
}
