import { useEffect, useRef, useState } from "react";
import axios from "axios";

/**
 * State for the import "Check file" dry run.
 * The result is cleared whenever any of `resetDeps` change (file, model, mapping),
 * so a passing check always belongs to the current inputs.
 */
export default function useImportCheck(resetDeps) {
    const [result, setResult] = useState(null);
    const [checking, setChecking] = useState(false);
    const [failed, setFailed] = useState(null);
    // Bumped on every reset/run so a slow response for stale inputs is ignored.
    const requestId = useRef(0);

    useEffect(() => {
        requestId.current += 1;
        setResult(null);
        setFailed(null);
        setChecking(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, resetDeps);

    const runCheck = async ({ file, importDefinitionId, modelClass, fieldMappings }) => {
        const currentRequest = ++requestId.current;
        setChecking(true);
        setResult(null);
        setFailed(null);

        const formData = new FormData();
        if (file) {
            formData.append("file", file);
        }
        if (importDefinitionId) {
            formData.append("import_definition_id", importDefinitionId);
        }
        formData.append("model_class", modelClass);
        Object.entries(fieldMappings).forEach(([header, field]) => {
            if (field) {
                formData.append(`field_mappings[${header}]`, field);
            }
        });

        try {
            const response = await axios.post(route("imports.dryRun"), formData);
            if (currentRequest === requestId.current) {
                setResult(response.data);
            }
        } catch (error) {
            if (currentRequest === requestId.current) {
                setFailed(error.response?.data?.message || error.response?.data?.error || error.message || "");
            }
        } finally {
            if (currentRequest === requestId.current) {
                setChecking(false);
            }
        }
    };

    return { result, checking, failed, runCheck };
}
