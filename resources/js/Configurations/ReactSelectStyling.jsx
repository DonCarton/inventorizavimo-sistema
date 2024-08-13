export const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#FFFFFF' : state.isDisabled ? '#9CA3AF' : '#FFFFFF',
        borderColor: state.isFocused ? '#5B21B6' : '#D1D5DB',
        '&:hover': {
            borderColor: '#5B21B6'
        },
        boxShadow: state.isFocused ? '0 0 0 1px #5B21B6' : 'none',
        borderRadius: '0.375rem',
        padding: '0.125rem',
        fontSize: '16px',
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
    placeholder: (provided, state) => ({
        ...provided,
        color: state.isDisabled ? '#FFFFFF' : '#000000'
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
