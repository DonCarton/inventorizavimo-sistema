import React from "react";

const SelectForSingleItem = ({id, options, name, value, noValueText, onChange, disabled, className = ''}) => {
    function Capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <select
            id={id}
            name={name}
            onChange={onChange}
            disabled={disabled}
            className={'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full ' + className}
            value={value}>
            <option value="">{noValueText}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>{Capitalize(option.label)}</option>
            ))}
        </select>
    );
};

export default SelectForSingleItem;
