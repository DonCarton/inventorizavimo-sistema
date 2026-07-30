import StringHelper from "@/Libs/StringHelper";

// Read-only summary of the header -> field mapping produced by SpreadsheetImportModal,
// shown after the user closes the wizard (RSI itself doesn't stay mounted/inline).
export default function FieldMappingSummary({ rawHeaders, normalizedHeaders, fieldMappings, fields }) {
    const labelFor = (fieldKey) =>
        fields.find((field) => field.key === fieldKey)?.label || fieldKey;

    const rows = normalizedHeaders
        .map((normalizedKey, index) => ({
            display: rawHeaders[index] || normalizedKey,
            mappedField: fieldMappings[normalizedKey],
        }))
        .filter((row) => row.mappedField);

    if (rows.length === 0) {
        return (
            <p className="text-sm text-gray-500 dark:text-gray-300">
                {StringHelper.__("No fields mapped yet")}.
            </p>
        );
    }

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-md">
            <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-700">
                <span className="w-1/2 text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                    {StringHelper.__("Field in file")}
                </span>
                <span className="text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                    {StringHelper.__("Field in system")}
                </span>
            </div>
            {rows.map((row) => (
                <div key={row.display} className="flex items-center gap-4 px-4 py-2">
                    <span className="font-medium w-1/2">{row.display}</span>
                    <span className="text-gray-500 dark:text-gray-300">
                        {labelFor(row.mappedField)}
                    </span>
                </div>
            ))}
        </div>
    );
}
