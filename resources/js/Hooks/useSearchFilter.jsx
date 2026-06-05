import { useState, useEffect, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';

/**
 * Custom hook for handling search filters, sorting, and keyboard navigation in index pages.
 * Triggers navigation via debounce on typing, immediately on blur, or on Enter key.
 *
 * @param {string} routeName - The route name to navigate to (e.g., 'inventoryItems.index')
 * @param {Object} initialParams - Initial query parameters from the page props
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 400)
 * @returns {Object} - Functions and state for search filtering
 */
export default function useSearchFilter(routeName, initialParams = {}, debounceMs = 200) {
    const [filterValues, setFilterValues] = useState({ ...initialParams });
    const pendingParams = useRef({ ...initialParams });
    const debounceTimer = useRef(null);

    // -------------------------------------------------------------------------
    // Core navigation — always reads from pendingParams so it has the
    // freshest values regardless of whether state has re-rendered yet.
    // -------------------------------------------------------------------------
    const navigate = useCallback((params) => {
        const clean = Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
        );
        router.get(route(routeName), clean, { preserveState: true, replace: true });
    }, [routeName]);

    // -------------------------------------------------------------------------
    // Debounced navigation — resets the timer on every keystroke.
    // -------------------------------------------------------------------------
    const scheduleNavigate = useCallback((params) => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => navigate(params), debounceMs);
    }, [navigate, debounceMs]);

    // Flush any pending debounce immediately (used by blur + Enter).
    const flushNavigate = useCallback((params) => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        navigate(params);
    }, [navigate]);

    // Cleanup on unmount.
    useEffect(() => () => clearTimeout(debounceTimer.current), []);

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Controlled input onChange — updates state and schedules a debounced request.
     */
    const onInputChange = useCallback((name, e) => {
        const value = e.target.value;
        pendingParams.current = { ...pendingParams.current, [name]: value };
        setFilterValues(prev => ({ ...prev, [name]: value }));
        scheduleNavigate(pendingParams.current);
    }, [scheduleNavigate]);

    /**
     * Blur handler — flushes immediately without waiting for the debounce.
     */
    const onInputBlur = useCallback((name, e) => {
        const value = e.target.value;
        pendingParams.current = { ...pendingParams.current, [name]: value };
        flushNavigate(pendingParams.current);
    }, [flushNavigate]);

    /**
     * Enter / NumpadEnter — same as blur, fires immediately.
     */
    const handleKeyDown = useCallback((name, e) => {
        const value = e.target.value;
        pendingParams.current = { ...pendingParams.current, [name]: value };
        flushNavigate(pendingParams.current);
    }, [flushNavigate]);

    /**
     * Select / dropdown onChange — always fires immediately (no debounce needed).
     */
    const onSelectChange = useCallback((name, e) => {
        const value = e.target.value;
        pendingParams.current = { ...pendingParams.current, [name]: value };
        setFilterValues(prev => ({ ...prev, [name]: value }));
        flushNavigate(pendingParams.current);
    }, [flushNavigate]);

    /**
     * Toggles sort direction or sets a new sort field — fires immediately.
     */
    const sortChanged = useCallback((name) => {
        const current = pendingParams.current;
        const updated = {
            ...current,
            sort_field: name,
            sort_direction: name === current.sort_field && current.sort_direction === 'asc'
                ? 'desc'
                : 'asc',
        };
        pendingParams.current = updated;
        setFilterValues(prev => ({
            ...prev,
            sort_field: updated.sort_field,
            sort_direction: updated.sort_direction,
        }));
        flushNavigate(updated);
    }, [flushNavigate]);

    /**
     * Resets all filters back to an empty state and navigates immediately.
     */
    const resetFilters = useCallback(() => {
        pendingParams.current = {};
        setFilterValues({});
        flushNavigate({});
    }, [flushNavigate]);

    const clearField = useCallback((name) => {
        pendingParams.current = { ...pendingParams.current, [name]: '' };
        setFilterValues(prev => ({ ...prev, [name]: '' }));
        flushNavigate(pendingParams.current);
    }, [flushNavigate]);

    return {
        filterValues,   // bind to controlled input `value` props
        onInputChange,
        onInputBlur,
        handleKeyDown,
        onSelectChange,
        sortChanged,
        clearField,
        resetFilters,
    };
}
