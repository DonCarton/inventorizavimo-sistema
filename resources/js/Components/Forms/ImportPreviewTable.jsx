import StringHelper from "@/Libs/StringHelper";

// Shows the first sample rows of the file laid out under the mapped system fields.
// When a dry-run result is supplied, cells (or whole rows) with errors are highlighted.
export default function ImportPreviewTable({
    rawHeaders,
    normalizedHeaders,
    sampleRows,
    fields,
    mapping,
    errors = [],
}) {
    const columns = normalizedHeaders
        .map((headerKey, index) => ({
            index,
            rawHeader: rawHeaders[index] || headerKey,
            fieldKey: headerKey ? mapping[headerKey] : null,
        }))
        .filter((column) => column.fieldKey);

    if (columns.length === 0 || sampleRows.length === 0) {
        return null;
    }

    const labelFor = (fieldKey) =>
        fields.find((field) => field.key === fieldKey)?.label || fieldKey;

    // Index errors by "row:attribute"; errors without an attribute apply to the whole row.
    const cellErrors = {};
    const rowErrors = {};
    errors.forEach((error) => {
        if (error.attribute) {
            const key = `${error.row}:${error.attribute}`;
            cellErrors[key] = [...(cellErrors[key] || []), error.message];
        } else {
            rowErrors[error.row] = [...(rowErrors[error.row] || []), error.message];
        }
    });

    return (
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                {StringHelper.__("First :count rows of the file, as they will be imported", {
                    count: sampleRows.length,
                })}
            </p>
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
                <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr className="text-left">
                            <th className="px-3 py-2 text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                                {StringHelper.__("Row")}
                            </th>
                            {columns.map((column) => (
                                <th key={column.index} className="px-3 py-2 whitespace-nowrap">
                                    <div className="text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                                        {labelFor(column.fieldKey)}
                                    </div>
                                    <div className="text-xs font-normal text-gray-400 dark:text-gray-500">
                                        {column.rawHeader}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {sampleRows.map((row, rowIndex) => {
                            // Row 1 is the header row, so data starts at row 2 (same numbering as the backend).
                            const rowNumber = rowIndex + 2;
                            const wholeRowErrors = rowErrors[rowNumber];

                            return (
                                <tr
                                    key={rowNumber}
                                    className={wholeRowErrors ? "bg-red-50 dark:bg-red-900/30" : ""}
                                    title={wholeRowErrors ? wholeRowErrors.join("\n") : undefined}
                                >
                                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{rowNumber}</td>
                                    {columns.map((column) => {
                                        const messages = cellErrors[`${rowNumber}:${column.fieldKey}`];
                                        const cell = row[column.index];

                                        return (
                                            <td
                                                key={column.index}
                                                title={messages ? messages.join("\n") : undefined}
                                                className={
                                                    "px-3 py-2 whitespace-nowrap max-w-xs truncate " +
                                                    (messages
                                                        ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                                                        : "text-gray-900 dark:text-gray-100")
                                                }
                                            >
                                                {cell ?? ""}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
