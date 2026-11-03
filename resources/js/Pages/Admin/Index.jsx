import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, router} from '@inertiajs/react';
import React, {useEffect, useState} from "react";
import FailureMessage from '@/Components/FailureMessage';
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";
import InputError from "@/Components/InputError.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import {TbAdjustmentsHorizontal, TbCheck, TbMail, TbSettings, TbUsers} from "react-icons/tb";

const CATEGORY_ICONS = {
    general: TbAdjustmentsHorizontal,
    email: TbMail,
    user: TbUsers,
};

// Ranges always start at the first cupboard / shelf (enforced by the backend); only the end is editable.
const RANGE_SETTINGS = {
    cupboard_range: {start: '1', inputMode: 'numeric', pattern: /^\d*$/, count: (end) => Number(end)},
    shelf_range: {start: 'A', inputMode: 'text', pattern: /^[A-Za-z]?$/, count: (end) => end.charCodeAt(0) - 64},
};

/** Translated text for a key, or the fallback when no translation exists. */
const translateOr = (key, fallback) => {
    const translated = StringHelper.__(key);
    return translated === key ? fallback : translated;
};

/** Saves one setting; tracks saving/saved/error state for its row. */
function useSettingSave(config) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!saved) return;
        const timer = setTimeout(() => setSaved(false), 2000);
        return () => clearTimeout(timer);
    }, [saved]);

    const save = (value, {onError} = {}) => {
        setSaving(true);
        setError(null);
        router.patch(route('systemConfigurations.update', {systemConfiguration: config.id}), {value}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setSaved(true),
            onError: (errors) => {
                setError(errors.value ?? Object.values(errors)[0]);
                onError?.();
            },
            onFinish: () => setSaving(false),
        });
    };

    return {save, saving, saved, error, clearError: () => setError(null)};
}

function SavedBadge({show}) {
    return (
        <span className={`inline-flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
              aria-live="polite">
            {show && <><TbCheck className="w-4 h-4" aria-hidden="true"/>{StringHelper.__("Saved")}</>}
        </span>
    );
}

function ToggleSetting({config, label}) {
    const stored = config.value?.value === '1';
    const [checked, setChecked] = useState(stored);
    const {save, saving, saved, error} = useSettingSave(config);

    const toggle = () => {
        const next = !checked;
        setChecked(next);
        save(next ? '1' : '0', {onError: () => setChecked(!next)});
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3">
                <SavedBadge show={saved}/>
                <span className="text-sm text-gray-600 dark:text-gray-300 w-16 text-right">
                    {StringHelper.__(checked ? "On" : "Off")}
                </span>
                <button type="button" role="switch" aria-checked={checked} aria-label={label}
                        disabled={saving} onClick={toggle}
                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60 ${checked ? 'bg-pink-700' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <span aria-hidden="true"
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}/>
                </button>
            </div>
            <InputError message={error}/>
        </div>
    );
}

function RangeSetting({config, range, label}) {
    const storedEnd = (config.value?.value ?? '').split('-')[1] ?? '';
    const [end, setEnd] = useState(storedEnd);
    const {save, saving, saved, error, clearError} = useSettingSave(config);
    const changed = end !== storedEnd;
    const count = end ? range.count(end) : 0;

    const submit = (e) => {
        e.preventDefault();
        save(`${range.start}-${end}`);
    };

    return (
        <form onSubmit={submit} className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
                <SavedBadge show={saved}/>
                <span className="inline-flex h-10 items-center rounded-md bg-gray-100 px-3 font-mono text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    {range.start}
                </span>
                <span className="text-gray-400" aria-hidden="true">–</span>
                <input type="text" inputMode={range.inputMode} aria-label={label}
                       value={end} maxLength={range.inputMode === 'numeric' ? 3 : 1}
                       onChange={(e) => {
                           if (range.pattern.test(e.target.value)) {
                               setEnd(e.target.value.toUpperCase());
                               clearError();
                           }
                       }}
                       className="h-10 w-16 rounded-md border-gray-300 text-center font-mono shadow-sm focus:border-pink-500 focus:ring-pink-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"/>
                {changed && (
                    <>
                        <button type="submit" disabled={saving || !end}
                                className="h-10 rounded-md bg-pink-800 px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800">
                            {StringHelper.__("Save")}
                        </button>
                        <button type="button" onClick={() => { setEnd(storedEnd); clearError(); }}
                                className="h-10 px-2 text-sm text-gray-500 underline-offset-2 hover:underline dark:text-gray-400">
                            {StringHelper.__("Cancel")}
                        </button>
                    </>
                )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
                {count > 0 ? StringHelper.__(":count options", {count}) : ' '}
            </span>
            <InputError message={error}/>
        </form>
    );
}

function TextSetting({config, label}) {
    const stored = config.value?.value ?? '';
    const [value, setValue] = useState(stored);
    const {save, saving, saved, error, clearError} = useSettingSave(config);
    const changed = value !== stored;

    return (
        <form onSubmit={(e) => { e.preventDefault(); save(value); }} className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
                <SavedBadge show={saved}/>
                <input type={config.value_type === 'int' ? 'number' : 'text'} aria-label={label}
                       value={value} onChange={(e) => { setValue(e.target.value); clearError(); }}
                       className="h-10 w-48 rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"/>
                {changed && (
                    <button type="submit" disabled={saving}
                            className="h-10 rounded-md bg-pink-800 px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-pink-700 disabled:opacity-50">
                        {StringHelper.__("Save")}
                    </button>
                )}
            </div>
            <InputError message={error}/>
        </form>
    );
}

function SettingRow({config}) {
    const label = translateOr(`setting.${config.key}`, config.name);
    const description = translateOr(`setting.${config.key}.description`, null);
    const range = RANGE_SETTINGS[config.key];

    let control;
    if (config.value_type === 'boolean') {
        control = <ToggleSetting config={config} label={label}/>;
    } else if (range) {
        control = <RangeSetting config={config} range={range} label={label}/>;
    } else {
        control = <TextSetting config={config} label={label}/>;
    }

    return (
        <li className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
                {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
            </div>
            <div className="shrink-0">{control}</div>
        </li>
    );
}

export default function Index({auth, myConfigurations, flash}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={
                <div className="flex items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("System configuration")}</h2>
                    <InformationIconToolTip
                        content={StringHelper.__("Settings change how the whole system behaves and take effect immediately") + '.'}
                        placement="right-end" classname="bg-black" color="black"
                        classnameForIcon="w-5 h-5 ml-1 mt-1"/>
                </div>
            }
        >
            <Head title={StringHelper.__("System configuration")}/>

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {flash.failure && <FailureMessage message={flash.failure}/>}
                    {Object.entries(myConfigurations).map(([category, configs]) => {
                        const Icon = CATEGORY_ICONS[category] ?? TbSettings;
                        return (
                            <section key={category} className="overflow-hidden bg-white shadow sm:rounded-lg dark:bg-gray-800">
                                <header className="flex items-center gap-4 border-b border-gray-100 border-l-4 border-l-pink-800 px-6 py-5 dark:border-gray-700 dark:border-l-pink-600">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200">
                                        <Icon className="h-6 w-6" aria-hidden="true"/>
                                    </span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {StringHelper.__(category.charAt(0).toUpperCase() + category.slice(1) + " configurations")}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {StringHelper.__(":count settings", {count: configs.length})}
                                        </p>
                                    </div>
                                </header>
                                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {configs.map((config) => <SettingRow key={config.id} config={config}/>)}
                                </ul>
                            </section>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
