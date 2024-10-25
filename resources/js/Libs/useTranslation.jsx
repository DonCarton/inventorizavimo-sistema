import { usePage } from "@inertiajs/react";

//TODO: MAKE IT WIDELY USED FOR ALL PAGES
export const useTranslation = () => {
    const { language } = usePage().props;

    const translate = (key, replacements = {}) => {
        let translation = language[key] || key;
        Object.keys(replacements).forEach(replaceKey => {
            translation = translation.replace(`:${replaceKey}`, replacements[replaceKey]);
        });
        return translation;
    };

    return { translate };
};
