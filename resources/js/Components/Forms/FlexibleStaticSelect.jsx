import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import {customStyles} from "@/Configurations/ReactSelectStyling.jsx";

const FlexibleStaticSelect = ({
                            id,
                            name,
                            value,
                            onChange,
                            options = [],
                            defaultValue,
                            customPlaceHolder = '',
                            customNoOptionsMessage = 'No options available',
                            customIsMulti = false,
                            customIsDisabled = false,
                        }) => {

    const handleChange = selectedOption => {
        if (customIsDisabled) { return; }

        if (customIsMulti) {
            onChange(selectedOption ? selectedOption.map(option => option.value) : []);
        } else {
            onChange(selectedOption ? selectedOption.value : null);
        }
    };

    const getValue = () => {
        if (!value || options.length === 0) return customIsMulti ? [] : null;
        
        if (customIsMulti) {
            return options.filter(option => value && value.includes(option.value));
        } else {
            return options.find(option => option.value === value);
        }
    };

    return (
        <Select
            id={id}
            name={name}
            options={options}
            isMulti={customIsMulti}
            isClearable
            isDisabled={customIsDisabled}
            value={getValue()}
            defaultValue={defaultValue}
            onChange={handleChange}
            styles={customStyles}
            classNamePrefix="react-select"
            noOptionsMessage={() => customNoOptionsMessage}
            placeholder={customPlaceHolder}
            menuPortalTarget={document.body}
        />
    );
};

export default FlexibleStaticSelect;
