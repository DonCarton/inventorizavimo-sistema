import AsyncSelect from 'react-select/async';
import {useEffect, useState} from "react";
import axios from "axios";
import {customStyles} from "@/Configurations/ReactSelectStyling.jsx";

const AsyncCustom = ({ itemId, fetchUrlPath, onChange, customPlaceHolder, customNoOptionsMessage, customLoadingMessage, customIsMulti = false, customIsDisabled = false }) => {
    const [defaultValue, setDefaultValue] = useState(null);
    useEffect(() => {
        const fetchDefaultValue = async () => {
            if (itemId) {
                axios.get(`${fetchUrlPath}/${itemId}`)
                    .then(response => {
                        const item = response.data;
                        setDefaultValue({ label: item.name, value: item.id });
                    })
                    .catch(error => {
                        console.error('Error fetching the item:', error);
                    });
            }
        }
        fetchDefaultValue();
    }, [itemId, fetchUrlPath]);

    const loadOptions = (inputValue) => {
        return axios.get(fetchUrlPath, {
            params: { search: inputValue }
        })
            .then(response => {
                return response.data.data.map(item => ({
                    label: item.name,
                    value: item.id
                }));
            })
            .catch(error => {
                console.error('Error loading options:', error);
                return [];
            });
    };

    return (
        <AsyncSelect cacheOptions defaultOptions isMulti={customIsMulti} isDisabled={customIsDisabled} loadOptions={loadOptions}
            value={defaultValue} onChange={onChange} styles={customStyles} noOptionsMessage={() => customNoOptionsMessage}
            placeholder={customPlaceHolder} loadingMessage={() => customLoadingMessage} menuPortalTarget={document.body}
        />
    );
};

export default AsyncCustom;
