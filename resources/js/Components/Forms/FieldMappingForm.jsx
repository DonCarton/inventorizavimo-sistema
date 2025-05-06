import { useState, useEffect } from "react";
import axios from "axios";

export default function FieldMappingForm({
    id,
    model,
    fileHeaders = [],
    value = {},
    onChange,
}) {
    const [importableFields, setImportableFields] = useState([]);

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
    const selectedFields = Object.values(value).filter(Boolean);
    return (
        <div id={id} className="mt-1 space-y-4">
            {fileHeaders.map((header) => 
            {
              const selectedValue = value[header] || '';
    
              // Compute selected fields *excluding* the one for this header
              const selectedElsewhere = Object.entries(value)
                  .filter(([key, val]) => key !== header && val)
                  .map(([_, val]) => val);
          
              // Filter available options for this header
              const availableOptions = Object.entries(importableFields)
                .filter(([fieldKey]) =>
                  !selectedElsewhere.includes(fieldKey) || fieldKey === selectedValue
              );
              return (
              <div key={header} className="flex items-center gap-4">
                  <span className="font-medium w-1/3">{header}</span>
                  <select
                      className="border rounded px-2 py-1 w-2/3"
                      value={value[header] || ""}
                      onChange={(e) =>
                          handleMappingChange(header, e.target.value)
                      }
                  >
                      <option value="">-- Do not map --</option>
                      {/*{Object.entries(importableFields || {}).map(
                          ([key, value]) => (
                              <option key={key} value={key} disabled={selectedFields.includes(key) && key !== selectedValue}>
                                  {value}
                              </option>
                          )
                      )}*/}
                      {availableOptions.map(([fieldKey, fieldLabel]) => (
                        <option key={fieldKey} value={fieldKey}>
                          {fieldLabel}
                        </option>
                      ))}
                  </select>
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
