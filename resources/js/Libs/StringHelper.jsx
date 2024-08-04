import { usePage } from "@inertiajs/react";

const StringHelper = {
    __(key, replace = {}) {
        const { language } = usePage().props;
        let translation = language[key] ? language[key] : key;
        Object.keys(replace).forEach(function (key) {
            translation = translation.replace(':' + key, replace[key]);
        });
        return translation;
    },
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    ShortenLength(str, length) {
        if (str.length > length) {
            return str.slice(0, length);
        }
        return str;
    }
};

export default StringHelper;
