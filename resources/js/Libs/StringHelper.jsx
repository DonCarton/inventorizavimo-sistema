import { usePage } from "@inertiajs/react";

const StringHelper = {
    /**
     * Translation method.
     * First param takes the key value to search for.
     * Second value an array of key values to replace keys within the translation string.
     * @param {string} key
     * @param {string} replace
     * @returns {string} translation
     * @private
     */
    __(key, replace = {}) {
        const { language } = usePage().props;
        let translation = language[key] ? language[key] : key;
        Object.keys(replace).forEach(function (key) {
            translation = translation.replace(':' + key, replace[key]);
        });
        return translation;
    },
    /**
     * Capitalizes the given string.
     * @param {string} str
     * @returns {string}
     * @constructor
     */
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Shortens the given string.
     * @param {string} str
     * @param {int} length
     * @returns {string} str
     * @constructor
     */
    ShortenLength(str, length) {
        if (str.length > length) {
            return str.slice(0, length);
        }
        return str;
    },

    HumanizeImpactList(data, labels = {}) {
        return Object.entries(data)
            .filter(([_, count]) => count > 0)
            .map(([key, count]) => {
                const label = labels[key] || key;
                return ` - ${count} ${label}\n`;
            })
            .join('');
    },
};

export default StringHelper;
