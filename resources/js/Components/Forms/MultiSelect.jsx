import React, {useState} from "react";

const MultiSelect = ({options, className = ''}) => {
    const COUNTRIES = ['Lithuania', 'Latvia', 'Estonia'];
    const [inputValue, setInputValue] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const handleChange = (event) => {
        setInputValue(event.target.value);
        setIsDropdownVisible(true);
    };

    const handleSelect = (country) => {
        setInputValue(country);
        setIsDropdownVisible(false);
    };
    return (
        <div className="relative">
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Type to search countries..."
                className="border border-gray-300 rounded-md pl-4 pr-10 py-2 w-64 focus:outline-none focus:border-blue-500"
            />
            <div
                className={`absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none ${isDropdownVisible ? 'rotate-180' : ''}`}>
                <svg className="fill-current h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 20 20">
                    <path
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
            </div>
            {isDropdownVisible && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-64">
                    {COUNTRIES.filter((country) =>
                        country.toLowerCase().includes(inputValue.toLowerCase())
                    ).map((country, index) => (
                        <li key={index} onClick={() => handleSelect(country)}
                            className="cursor-pointer p-2 hover:bg-gray-100">
                            {country}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
        ;
};
export default MultiSelect;
