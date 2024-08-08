import React from 'react';
import StringHelper from '@/Libs/StringHelper';

const SteamDropdown = ({options, name, disabled = false, value, onChange, className = ''}) => {
    return (
        <select
            name={name}
            disabled={disabled}
            onChange={onChange}
            className={'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm' + className}
            value={value}>
                <option value="">{StringHelper.Capitalize(StringHelper.__("Choose a value"))}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>{StringHelper.__(StringHelper.Capitalize(option.label))}</option>
            ))}
        </select>
    );
};
export default SteamDropdown;
