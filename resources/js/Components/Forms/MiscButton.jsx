import React from "react";
import { Link } from "@inertiajs/react";

export default function MiscButton({classVariant = "default", icon: Icon, iconPosition = "right", as = "link", to, children, onClick, className = '', ...props}) {

    const classChoices = {
        "default": "w-full justify-between inline-flex items-center px-4 py-2 whitespace-nowrap bg-amber-500 dark:bg-amber-400 border border-amber-500 hover:border-amber-800 dark:border-amber-500 rounded-md font-semibold text-xs text-white dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-amber-800 dark:hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150 " + className,
        "blue": "w-full justify-between inline-flex items-center px-4 py-2 whitespace-nowrap bg-blue-500 dark:bg-blue-400 border border-blue-500 hover:border-blue-800 dark:border-blue-500 rounded-md font-semibold text-xs text-white dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-blue-800 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150 " + className,
        "green": "w-full justify-between inline-flex items-center px-4 py-2 whitespace-nowrap bg-green-500 dark:bg-green-400 border border-green-500 hover:border-green-800 dark:border-green-500 rounded-md font-semibold text-xs text-white dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-green-800 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150 " + className,
        "red": "w-full justify-between inline-flex items-center px-4 py-2 whitespace-nowrap bg-red-500 dark:bg-red-400 border border-red-500 hover:red-amber-800 dark:border-red-500 rounded-md font-semibold text-xs text-white dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-red-800 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150 " + className
    };

    if (as === "link") {
        return (
            <Link {...props} href={to} className={classChoices[classVariant]}>
            {Icon && iconPosition === "left" && <Icon className="mr-1 w-4 h-4" />}
                {children}
                {Icon && iconPosition === "right" && <Icon className="ml-1 w-4 h-4" />}
            </Link>
        )
    }
    return(
        <button {...props} onClick={onClick} className={classChoices[classVariant]}>
            {Icon && iconPosition === "left" && <Icon className="mr-1 w-4 h-4" />}
            {children}
            {Icon && iconPosition === "right" && <Icon className="ml-1 w-4 h-4" />}
        </button>
    )
}