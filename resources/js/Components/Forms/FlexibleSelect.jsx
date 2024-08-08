import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import axios from 'axios';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#FFFFFF' : state.isDisabled ? 'gray' : 'transparent',
        borderColor: state.isFocused ? '#5B21B6' : '#D1D5DB',
        '&:hover': {
            borderColor: '#5B21B6'
        },
        boxShadow: state.isFocused ? '0 0 0 1px #5B21B6' : 'none',
        borderRadius: '0.375rem',
        padding: '0.125rem',
        fontSize: '16px'
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#FFFFFF',
        color: '#D1D5DB',
        borderRadius: '0.375rem',
        marginTop: '0.5rem',
        zIndex: 9999,
        position: 'absolute',
    }),
    menuPortal: base => ({...base, zIndex: 9999}),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#E0E0E6' : 'transparent',
        color: state.isFocused ? 'black' : '#000000',
        '&:hover': {
            backgroundColor: '#E0E0E6',
            color: '#000000'
        },
    }),
    singleValue: (provided, state) => ({
        ...provided,
        color: state.isDisabled ? '#FFFFFF' : '#1F2937',
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#BE185D',
        color: 'white',
        borderRadius: '3px'
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: 'white',
    }),
    input: (base) => ({
        ...base,
        'input:focus': {
            boxShadow: 'none',
        },
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: 'white',
        '&:hover': {
            backgroundColor: '#9D174D',
            color: 'white'
        }
    })
};

const FlexibleSelect = ({
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
