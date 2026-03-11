import { router } from '@inertiajs/react';

/**
 * Custom hook for handling search filters, sorting, and keyboard navigation in index pages.
 *
 * @param {string} routeName - The route name to navigate to (e.g., 'inventoryItems.index')
 * @param {Object} initialParams - Initial query parameters from the page props
 * @returns {Object} - Functions and state for search filtering
 */
export default function useSearchFilter(routeName, initialParams = {}) {
    const queryParams = { ...initialParams };

    /**
     * Updates a search field and triggers navigation
     */
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route(routeName), queryParams);
    };

    /**
     * Handles keydown events for search inputs - triggers search on Enter
     * Works correctly on both desktop and mobile devices
     */
    const handleKeyDown = (name, e) => {
        if (e.key === 'Enter' || e.key === 'NumpadEnter') {
            e.preventDefault();
            searchFieldChanged(name, e.target.value);
        }
    };

    /**
     * Handles select/dropdown changes
     */
    const onSelectChange = (name, e) => {
        searchFieldChanged(name, e.target.value);
    };

    /**
     * Toggles sort direction or sets a new sort field
     */
    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            queryParams.sort_direction = queryParams.sort_direction === 'asc' ? 'desc' : 'asc';
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route(routeName), queryParams);
    };

    return {
        queryParams,
        searchFieldChanged,
        handleKeyDown,
        onSelectChange,
        sortChanged,
    };
}
