import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FieldMappingForm({ id, selectedModel, fileHeaders = [], value = {}, onChange }) {
  const [importableFields, setImportableFields] = useState([]);

  useEffect(() => {
    if (!selectedModel) return;

    axios
      .get(`/select/importable-fields`, { params: { model: selectedModel } })
      .then(res => setImportableFields(res.data.fields))
      .catch(err => {
        console.error("Failed to fetch importable fields:", err);
        setImportableFields([]);
      });
  }, [selectedModel]);

  const handleMappingChange = (header, mappedField) => {
    const updated = {
      ...value,
      [header]: mappedField,
    };
    onChange?.(updated);
  };

  return (
    <div id={id} className="mt-1 space-y-4">
      {fileHeaders.map(header => (
        <div key={header} className="flex items-center gap-4">
          <span className="font-medium w-1/3">{header}</span>
          <select
            className="border rounded px-2 py-1 w-2/3"
            value={value[header] || ''}
            onChange={(e) => handleMappingChange(header, e.target.value)}
          >
            <option value="">-- Do not map --</option>
            {importableFields.map(field => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>
      ))}

      <pre className="mt-4 text-xs text-gray-500">
        Mapping: {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}
