import React from 'react';
import {__} from '@/Libs/Lang.jsx';

const SteamDropdown = ({options, name, value, onChange, className = ''}) => {
    function Capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <select
            name={name}
            onChange={onChange}
            className={'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm' + className}
            value={value}>
                <option value="">{__("Choose a value")}</option>
            {options.map(option => (
                <option key={option.id} value={option.name}>{__(Capitalize(option.name))}</option>
            ))}
        </select>
    );
};

export default SteamDropdown;
