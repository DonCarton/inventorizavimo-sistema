import { useRef, useCallback } from "react";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { spreadsheetImportTheme } from "./spreadsheetImportTheme";
import { spreadsheetImportTranslations } from "./spreadsheetImportTranslations";

// RSI's own ColumnType enum values (react-spreadsheet-import/types/steps/MatchColumnsStep/MatchColumnsStep.d.ts):
// empty=0, ignored=1, matched=2, matchedCheckbox=3, matchedSelect=4, matchedSelectOptions=5
const MATCHED_COLUMN_TYPE_THRESHOLD = 2;

// Reuses the app's existing file upload + imports.previewHeaders flow (rawHeaders/normalizedHeaders/sampleRows
// and the importable `fields` list are fetched by the caller) and only hands RSI the Match Columns + Validate
// Data steps via `initialStepState`, skipping RSI's own Upload step entirely. This keeps a single source of
// truth for header slugging (backend's Str::slug, via imports.previewHeaders) instead of duplicating it
// client-side, and lets the caller reuse the same `fields` list to render a mapping summary.
export default function SpreadsheetImportModal({
    isOpen,
    onClose,
    fields,
    rawHeaders,
    normalizedHeaders,
    sampleRows,
    onMapped,
}) {
    const capturedMapping = useRef({});

    const matchColumnsStepHook = useCallback(
        async (table, rawData, columns) => {
            const mapping = {};
            columns.forEach((column) => {
                const normalizedHeader = normalizedHeaders[column.index];
                if (column.type >= MATCHED_COLUMN_TYPE_THRESHOLD && normalizedHeader) {
                    mapping[normalizedHeader] = column.value;
                }
            });
            capturedMapping.current = mapping;
            return table;
        },
        [normalizedHeaders],
    );

    const handleSubmit = useCallback(() => {
        onMapped(capturedMapping.current);
        onClose();
    }, [onMapped, onClose]);

    if (!isOpen || !fields || fields.length === 0) {
        return null;
    }

    return (
        <ReactSpreadsheetImport
            isOpen={isOpen}
            onClose={onClose}
            fields={fields}
            isNavigationEnabled={false}
            initialStepState={{
                type: "matchColumns",
                data: sampleRows,
                headerValues: rawHeaders,
            }}
            matchColumnsStepHook={matchColumnsStepHook}
            onSubmit={handleSubmit}
            customTheme={spreadsheetImportTheme}
            translations={spreadsheetImportTranslations}
        />
    );
}
