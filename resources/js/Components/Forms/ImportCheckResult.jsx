import StringHelper from "@/Libs/StringHelper";

// Outcome of the dry-run ("Check file"): a success note, or the list of errors that would occur.
export default function ImportCheckResult({ result }) {
    if (!result) {
        return null;
    }

    if (result.passed) {
        return (
            <div className="p-3 rounded-md border border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900/30 dark:text-green-200 text-sm">
                {StringHelper.__("File check passed: all :count rows can be imported", {
                    count: result.total_rows,
                })}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="p-3 rounded-md border border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200 text-sm">
                {StringHelper.__("File check failed: :errors errors found while checking :count rows", {
                    errors: result.error_count,
                    count: result.total_rows,
                })}
            </div>
            {result.error_count > result.errors.length && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {StringHelper.__("Showing the first :shown of :total errors", {
                        shown: result.errors.length,
                        total: result.error_count,
                    })}
                </p>
            )}
            <div className="overflow-x-auto max-h-96 border border-gray-200 dark:border-gray-700 rounded-md">
                <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                        <tr className="text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                            <th className="px-3 py-2">{StringHelper.__("Row")}</th>
                            <th className="px-3 py-2">{StringHelper.__("Field in system")}</th>
                            <th className="px-3 py-2">{StringHelper.__("Value")}</th>
                            <th className="px-3 py-2">{StringHelper.__("Reason")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {result.errors.map((error, index) => (
                            <tr key={index}>
                                <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{error.row}</td>
                                <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{error.field || "—"}</td>
                                <td className="px-3 py-2 text-gray-900 dark:text-gray-100 max-w-xs truncate" title={error.value ?? ""}>
                                    {error.value ?? ""}
                                </td>
                                <td className="px-3 py-2 text-red-700 dark:text-red-300">{error.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
