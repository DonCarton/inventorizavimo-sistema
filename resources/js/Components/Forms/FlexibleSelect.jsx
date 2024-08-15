import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import axios from 'axios';
import {customStyles} from "@/Configurations/ReactSelectStyling.jsx";

const FlexibleSelect = ({
                            id,
                            name,
                            value,
                            onChange,
                            defaultValue,
                            fetchUrlPath,
                            customPlaceHolder = '',
                            customNoOptionsMessage = 'No options available',
                            customLoadingMessage = 'Fetching options...',
                            customIsMulti = false,
                            customIsDisabled = false
                        }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchItemTypes = async () => {
            try {
                const response = await axios.get(fetchUrlPath);
                const returnedData = response.data.map(item => ({
                    value: item.id,
                    label: item.name
                }));
                setOptions(returnedData);
            } catch (error) {
                console.error('Error fetching item types:', error);
            }
        };

        fetchItemTypes();
    }, [fetchUrlPath]);

    const handleChange = selectedOption => {
        if (customIsMulti) {
            onChange(selectedOption ? selectedOption.map(option => option.value) : []);
        } else {
            onChange(selectedOption ? selectedOption.value : null);
        }
    };

    const getValue = () => {
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
            loadingMessage={() => customLoadingMessage}
            menuPortalTarget={document.body}
        />
    );
};

export default FlexibleSelect;
