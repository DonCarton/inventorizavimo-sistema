import React from "react";
import { Link } from "@inertiajs/react";

export default function MiscButton({icon: Icon, iconPosition = "right", as = "link", to, children, onClick, className = '', ...props}) {
    if (as === "link") {
        return (
            <Link {...props} href={to} className="inline-flex items-center px-4 py-2 bg-amber-500 dark:bg-amber-400 border border-amber-500 hover:border-amber-800 dark:border-amber-500 rounded-md font-semibold text-xs text-white dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-amber-800 dark:hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150">
                {Icon && iconPosition === "left" && <Icon className="mr-1 w-4 h-4" />}
                {children}
                {Icon && iconPosition === "right" && <Icon className="ml-1 w-4 h-4" />}
            </Link>
        )
    }
    return(
        <button {...props} onClick={onClick} className="inline-flex items-center px-4 py-2 bg-amber-500 dark:bg-amber-400 border border-amber-500 hover:border-amber-800 dark:border-amber-500 rounded-md font-semibold text-xs text-white dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-amber-800 dark:hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150">
            {Icon && iconPosition === "left" && <Icon className="mr-1 w-4 h-4" />}
            {children}
            {Icon && iconPosition === "right" && <Icon className="ml-1 w-4 h-4" />}
        </button>
    )
}