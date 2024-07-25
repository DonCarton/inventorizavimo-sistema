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
    }
};

export default StringHelper;
