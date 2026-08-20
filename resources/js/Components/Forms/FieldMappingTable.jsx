import StringHelper from "@/Libs/StringHelper";

const selectClassName =
    "w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm text-sm";

// Maps each file column (keyed by its slugged header, same as the backend's Str::slug)
// to one system field. A field picked for one column is hidden from every other column.
export default function FieldMappingTable({
    rawHeaders,
    normalizedHeaders,
    sampleRows,
    fields,
    value,
    onChange,
}) {
    const handleChange = (headerKey, fieldKey) => {
        const updated = { ...value };
        if (fieldKey) {
            updated[headerKey] = fieldKey;
        } else {
            delete updated[headerKey];
        }
        onChange(updated);
    };

    const exampleFor = (columnIndex) =>
        sampleRows
            .map((row) => row[columnIndex])
            .find((cell) => cell !== null && cell !== undefined && cell !== "");

    return (
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
            <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr className="text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                        <th className="px-4 py-2">{StringHelper.__("Field in file")}</th>
                        <th className="px-4 py-2">{StringHelper.__("Example value")}</th>
                        <th className="px-4 py-2 w-1/3">{StringHelper.__("Field in system")}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {normalizedHeaders.map((headerKey, index) => {
                        if (!headerKey) return null;

                        const current = value[headerKey] || "";
                        const usedElsewhere = new Set(
                            Object.entries(value)
                                .filter(([key, fieldKey]) => key !== headerKey && fieldKey)
                                .map(([, fieldKey]) => fieldKey),
                        );
                        const options = fields.filter((field) => !usedElsewhere.has(field.key));
                        const example = exampleFor(index);

                        return (
                            <tr key={headerKey}>
                                <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">
                                    {rawHeaders[index] || headerKey}
                                </td>
                                <td className="px-4 py-2 text-gray-500 dark:text-gray-400 max-w-xs truncate" title={example ?? ""}>
                                    {example ?? "—"}
                                </td>
                                <td className="px-4 py-2">
                                    <select
                                        className={selectClassName}
                                        value={current}
                                        onChange={(e) => handleChange(headerKey, e.target.value)}
                                    >
                                        <option value="">-- {StringHelper.__("Do not map")} --</option>
                                        {options.map((field) => (
                                            <option key={field.key} value={field.key}>
                                                {field.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
