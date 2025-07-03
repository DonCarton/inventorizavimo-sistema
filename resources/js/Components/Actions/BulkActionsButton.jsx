import StringHelper from "@/Libs/StringHelper";
import React, { useRef, useState, useEffect } from "react";

const BulkActionsButton = ({ children }) => {
    const dropdownRef = useRef(null);
    const [showItems, setShowItems] = useState(false);
    
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowItems(false);
        }
    };
    const items = React.Children.toArray(children);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (items.length === 0) return null;

    if (items.length === 1) {
        return (
            <>
                {items[0]}
            </>
        );
    };

    return (
        <div
            id="dropdown-interactions"
            name="interactions"
            ref={dropdownRef}
        >
            <button
                type="button"
                className="flex items-center px-4 bg-white font-semibold uppercase text-gray-700 dark:text-gray-300 border-2 border-gray-300 rounded-lg focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setShowItems((prev) => !prev)}
            >
                {StringHelper.__("Action")}
                <span className="mx-2 h-4 border-l border-gray-700"></span>
                <svg
                    className={`w-4 h-4 transition-transform transform ${showItems ? "rotate-180" : "rotate-0"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className={`absolute mt-2 w-40 space-y-1 transition-all duration-300 ease-out transform z-50 ${
                    showItems ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
            >
                {items.map((item, index) => (
                    <div key={index} className="w-full">{item}</div>
                ))}
            </div>
        </div>
    );
};

export default BulkActionsButton;
