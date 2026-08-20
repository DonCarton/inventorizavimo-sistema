import { useEffect, useState } from "react";
import StringHelper from "@/Libs/StringHelper";
import autoMapFields from "@/Libs/autoMapFields";
import SecondaryButton from "@/Components/SecondaryButton";
import FieldMappingTable from "@/Components/Forms/FieldMappingTable";
import ImportPreviewTable from "@/Components/Forms/ImportPreviewTable";
import ImportCheckResult from "@/Components/Forms/ImportCheckResult";

// Mapping table + preview of the first rows + "Check file" dry run, shared by the
// Create and Edit import definition pages.
export default function ImportMappingSection({
    rawHeaders,
    normalizedHeaders,
    sampleRows,
    fields,
    aliases = {},
    mapping,
    onMappingChange,
    autoMapOnEmpty = false,
    check,
    onCheck,
}) {
    const hasMapping = Object.values(mapping).some(Boolean);
    // How many columns the last auto-map filled in (null = not run yet).
    const [autoMappedCount, setAutoMappedCount] = useState(null);

    // `quietWhenNone`: the automatic run on load only reports when it actually mapped something.
    const applyAutoMap = (quietWhenNone = false) => {
        const mappedBefore = Object.values(mapping).filter(Boolean).length;
        const next = autoMapFields(normalizedHeaders, fields, aliases, mapping);
        const added = Object.values(next).filter(Boolean).length - mappedBefore;

        if (added > 0) {
            onMappingChange(next);
        }
        setAutoMappedCount(added === 0 && quietWhenNone ? null : added);
    };

    // Create page: pre-fill matching columns whenever a new file or record type
    // is loaded with an empty mapping. Never touches a mapping the user has started.
    useEffect(() => {
        setAutoMappedCount(null);
        if (autoMapOnEmpty && !hasMapping) {
            applyAutoMap(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [normalizedHeaders, fields, aliases]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <SecondaryButton onClick={() => applyAutoMap()}>
                    {StringHelper.__("Auto-map matching columns")}
                </SecondaryButton>
                {autoMappedCount !== null && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {autoMappedCount > 0
                            ? StringHelper.__("Columns mapped automatically by matching names: :count. Please review them", {
                                  count: autoMappedCount,
                              })
                            : StringHelper.__("No more columns with matching names were found")}
                    </span>
                )}
            </div>

            <FieldMappingTable
                rawHeaders={rawHeaders}
                normalizedHeaders={normalizedHeaders}
                sampleRows={sampleRows}
                fields={fields}
                value={mapping}
                onChange={onMappingChange}
            />

            <ImportPreviewTable
                rawHeaders={rawHeaders}
                normalizedHeaders={normalizedHeaders}
                sampleRows={sampleRows}
                fields={fields}
                mapping={mapping}
                errors={check.result?.errors}
            />

            <div className="flex items-center gap-3">
                <SecondaryButton onClick={onCheck} disabled={!hasMapping || check.checking}>
                    {StringHelper.__("Check file")}
                </SecondaryButton>
                {check.checking && (
                    <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        {StringHelper.__("Checking file")}...
                    </span>
                )}
            </div>

            {check.failed !== null && (
                <div className="p-3 rounded-md border border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200 text-sm">
                    {StringHelper.__("The file check could not be completed")}
                    {check.failed ? `: ${check.failed}` : "."}
                </div>
            )}

            <ImportCheckResult result={check.result} />
        </div>
    );
}
