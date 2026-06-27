import React from "react";
import { Link } from "@inertiajs/react";

export default function MenuActionButton({as = "button", to, onClick, icon: Icon, colorVariant = "maroon", children, ...props}) {

    const colorChoices = {
        maroon: "bg-pink-800 dark:bg-gray-200 text-white dark:text-gray-800 hover:bg-pink-700 dark:hover:bg-white",
        green: "bg-green-500 dark:bg-green-400 text-white dark:text-gray-300 hover:bg-green-800 dark:hover:bg-green-800",
    };

    const className = `flex items-center justify-between w-full px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-widest shadow-sm transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${colorChoices[colorVariant]}`;

    if (as === "link") {
        return (
            <Link {...props} href={to} className={className}>
                {children}
                {Icon && <Icon className="ml-2 w-4 h-4" />}
            </Link>
        );
    }
    return (
        <button {...props} type="button" onClick={onClick} className={className}>
            {children}
            {Icon && <Icon className="ml-2 w-4 h-4" />}
        </button>
    );
}
