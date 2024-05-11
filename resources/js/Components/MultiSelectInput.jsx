import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const MultiSelectInput = ({ value, onChange }) => {
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/laboratories')
            .then(response => {
                setOptions(response.data.map(role => ({
                    value: role.id,
                    label: role.name
                })));
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching labs:', error);
                setIsLoading(false);
            });
    }, []);

    const customStyles = {
        container: (provided, state) => ({
            ...provided,
            width: '100%', // Set width to 100% of container
        }),
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#7c3aed' : '#e2e8f0', // Customize border color
            '&:hover': {
                borderColor: '#7c3aed', // Customize border color on hover
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#7c3aed' : 'white', // Customize background color
            '&:hover': {
                backgroundColor: '#f7fafc', // Customize background color on hover
            },
        }),
        multiValue: (provided, state) => ({
            ...provided,
            backgroundColor: '#7c3aed', // Customize background color of selected values
        }),
    };

    const handleChange = (selectedOptions) => {
        onChange(selectedOptions.map(option => option.value));
    };

    return (
        <Select
            options={options}
            isMulti
            isLoading={isLoading}
            value={options.filter(option => value.includes(option.value))}
            onChange={handleChange}
            styles={customStyles} // Apply custom styles
        />
    );
};

export default MultiSelectInput;
