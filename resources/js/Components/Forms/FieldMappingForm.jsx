import { useState, useEffect, useRef } from "react";
import axios from "axios";
import StringHelper from "@/Libs/StringHelper";
import SelectDropdownObjects from "./SelectDropdownObjects";

export default function FieldMappingForm({
    id,
    model,
    fileHeaders,
    rawHeaders = [],
    value,
    onChange,
}) {
    const [importableFields, setImportableFields] = useState([]);
    const didMount = useRef(false);
    useEffect(() => {
        if (!model) return;
        async function fetchMappingFields() {
            const response = await axios.post(
                route("imports.importableFields", { model })
            );
            setImportableFields(response.data.humanReadable);
        }
        fetchMappingFields();
    }, [model]);

    const handleMappingChange = (header, mappedField) => {
        const updated = {
            ...value,
            [header]: mappedField,
        };
        onChange?.(updated);
    };
    useEffect(() => {
        if (didMount.current){
            onChange({});
        } else {
            didMount.current = true;
        }
    },[fileHeaders,model]);
    const selectedFields = Object.values(value).filter(Boolean);
    return (
        <div id={id} className="mt-1 space-y-4">
            {
                fileHeaders.map((normalizedKey, index) => {
                    const displayLabel = rawHeaders[index] || normalizedKey;
                    const selectedValue = value[normalizedKey] || '';
                    const selectedElsewhere = Object.entries(value)
                        .filter(([key, val]) => key !== normalizedKey && val)
                        .map(([_, val]) => val);
                    const availableOptions = Object.entries(importableFields)
                        .filter(([fieldKey]) => !selectedElsewhere.includes(fieldKey) || fieldKey === selectedValue);

                    return (
                        <div key={normalizedKey} className="flex items-center gap-4">
                            <span className="font-medium w-1/3">{displayLabel}</span>
                            <SelectDropdownObjects
                                showEmptyValue={true}
                                className="w-full"
                                value={selectedValue}
                                onChange={(e) => handleMappingChange(normalizedKey, e.target.value)}
                                options={availableOptions}
                            />
                        </div>
                    );
                })
            }
        </div>
    );
}
