import React, {useState, useEffect, useRef} from "react";

export default function GroupButtonDropdown({nameOfDropdownButton = 'Actions', options, id, name, children}){
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
            {/*<div className={`${showDropdown ? '' : 'hidden'} absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg`}>*/}
            {/*    {options.map((option, index) => (*/}
            {/*        <div key={index} className={`px-4 py-2 ${index < options.length - 1 ? 'border-b' : ''}`}>*/}
            {/*            {option}*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}
            {showDropdown ? <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg">{children}</div> : null}
        </div>
        // <button className="relative px-2 py-2 bg-white border-2 rounded-lg text-gray-800 4xl:text-xl xl:text-lg sm:text-md font-semibold uppercase" id={id} name={name} onClick={exposeDropdown}>
        //     {nameOfDropdownButton}
        //     <span className="ml-2">V</span>
        //     {showDropdown ? <div className="absolute right-0 mt-4 w-44 bg-white rounded-lg shadow-lg">{children}</div> : null}
        // </button>
    )
}
