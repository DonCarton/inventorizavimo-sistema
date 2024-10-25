import React, {useState, useEffect, useRef} from "react";

export default function GroupButtonDropdown({nameOfDropdownButton = 'Actions', children}){
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    function exposeDropdown(){
        setShowDropdown(!showDropdown);
    }
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    return(
        <div className="relative" ref={dropdownRef}>
            <button onClick={exposeDropdown}
                    className="flex items-center px-4 py-2 bg-white 4xl:text-xl xl:text-lg sm:text-md font-semibold uppercase text-gray-700 dark:text-gray-300 border-2 border-gray-300 rounded-lg focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700">
                {nameOfDropdownButton}
                <span className="mx-2 h-4 border-l border-gray-700"></span>
                <svg
                    className={`ml-2 w-4 h-4 transition-transform transform ${showDropdown ? 'rotate-180' : 'rotate-0'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            {showDropdown ? <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg">{children}</div> : null}
        </div>
    )
}
