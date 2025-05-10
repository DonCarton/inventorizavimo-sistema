import { useState, useEffect, useRef } from "react";
import axios from "axios";
import StringHelper from "@/Libs/StringHelper";
import SelectDropdownObjects from "./SelectDropdownObjects";

export default function FieldMappingForm({
    id,
    model,
    fileHeaders,
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
                fileHeaders.map(
                    (header) => 
                    {
                        const selectedValue = value[header] || '';
                        // Compute selected fields *excluding* the one for this header
                        const selectedElsewhere = Object.entries(value).filter(([key, val]) => key !== header && val).map(([_, val]) => val);
                        // Filter available options for this header
                        const availableOptions = Object.entries(importableFields).filter(([fieldKey]) => !selectedElsewhere.includes(fieldKey) || fieldKey === selectedValue);
                        return (
                            <div key={header} className="flex items-center gap-4">
                                <span className="font-medium w-1/3">{header}</span>
                                <SelectDropdownObjects className="w-full" value={value[header] || ""} onChange={(e) => handleMappingChange(header, e.target.value)} options={availableOptions} />
                            </div>
                        )
                    }
                )
            }
            <pre className="mt-4 text-xs text-gray-500">
                Mapping: {JSON.stringify(value, null, 2)}
            </pre>
        </div>
    );
}
