import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import {customStyles} from "@/Configurations/ReactSelectStyling.jsx";

const FlexibleAsyncSelect = ({
                            id,
                            name,
                            value,
                            onChange,
                            fetchUrlPath,
                            customPlaceHolder = '',
                            customNoOptionsMessage = 'No options available',
                            customLoadingMessage = 'Fetching options...',
                            customIsMulti = false,
                            customIsDisabled = false
                        }) => {
    const [options, setOptions] = useState([]);
    const [defaultOptions, setDefaultOptions] = useState([]);
    useEffect(() => {
        const fetchDefaultOptions = async () => {
            try {
                const response = await axios.get(fetchUrlPath, {
                    params: {
                        page: 1,
                    },
                });

                const items = response.data.data.map(item => ({
                    value: item.id,
                    label: item.name,
                }));

                setDefaultOptions(items);
            } catch (error) {
                console.error("There was an error fetching the items!", error);
            }
        };

        fetchDefaultOptions();
    }, []);
    const loadOptions = async (inputValue, callback) => {
        try {
            const response = await axios.get(fetchUrlPath, {
                params: {
                    search: inputValue,
                    page: 1,
                },
            });

            const returnedData = response.data.data.map(item => ({
                value: item.id,
                label: item.name,
            }));

            callback(returnedData);

        } catch (error) {
            console.error("There was an error fetching the cupboards!", error);
            callback([]);
        }
    };

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
        <AsyncSelect
            id={id}
            name={name}
            loadOptions={loadOptions}
            isMulti={customIsMulti}
            isClearable
            isDisabled={customIsDisabled}
            onChange={handleChange}
            value={getValue()}
            defaultOptions={defaultOptions}
            cacheOptions
            styles={customStyles}
            classNamePrefix="react-async-select"
            noOptionsMessage={() => customNoOptionsMessage}
            placeholder={customPlaceHolder}
            loadingMessage={() => customLoadingMessage}
            menuPortalTarget={document.body}
        />
    );
};

export default FlexibleAsyncSelect;
