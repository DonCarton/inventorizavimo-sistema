import InputError from '@/Components/InputError';
import InputLabel from '@/Components/Forms/InputLabel.jsx';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import StringHelper from '@/Libs/StringHelper';
import Checkbox2 from '@/Components/Checkbox2';

export default function UpdateConfiguration({ className = '', configurations, sectionName, sectionDescription }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        configurations: {}
    });

    useEffect(() => {
        if (configurations) {
            const initialData = configurations.reduce((acc, config) => {
                if (typeof config.boolean_value === 'boolean') {
                    acc[config.key] = config.boolean_value;
                } else if (typeof config.integer_value === 'number') {
                    acc[config.key] = config.integer_value;
                } else if (typeof config.string_value === 'string') {
                    acc[config.key] = config.string_value;
                } else {
                    acc[config.key] = '';
                }
                return acc;
            }, {});
            setData('configurations', initialData);
        }
    }, [configurations]);

    const submit = (e) => {
        e.preventDefault();

        patch(route('systemConfigurations.update'), {
            data: data.configurations,
            preserveScroll: true,
        });
    };

    const renderInputField = (config) => {
        const value = data.configurations[config.key];
        if (typeof value === 'boolean') {
            return (
                <Checkbox2
                    label={config.name}
                    checked={value}
                    onChange={(e) => setData('configurations', {
                        ...data.configurations,
                        [config.key]: e.target.checked
                    })}
                />
            );
        } else if (typeof value === 'number') {
            return (
                <input
                    title={value}
                    type="number"
                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                    value={value}
                    onChange={(e) => setData('configurations', {
                        ...data.configurations,
                        [config.key]: parseInt(e.target.value, 10),
                    })}
                />
            );
        } else if (typeof value === 'string') {
            return (
                <TextInput
                    title={value}
                    className="mt-1 block w-full"
                    value={value}
                    onChange={(e) => setData('configurations', {
                        ...data.configurations,
                        [config.key]: e.target.value,
                })}/>
            );
        }
        return null;
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{StringHelper.__(sectionName)}</h2>

                {sectionDescription && <p className="mt-1 mb-1 text-sm text-gray-600 dark:text-gray-400">
                    {StringHelper.__(sectionDescription)}.
                </p>}
            </header>
            <form onSubmit={submit} className="mt-2">
            {configurations.map((config) => (
                <div key={config.id} className="mb-4">
                    {config.boolean_value === null && <InputLabel htmlFor={config.name} value={StringHelper.__(config.name)} />}
                    {renderInputField(config)}
                    <InputError className="mt-2" message={errors[config.key]}/>
                </div>
                ))}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>{StringHelper.__("Save")}</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">{StringHelper.__("Saved")}.</p>
                    </Transition>
                </div>
            </form>
        </section>
    )
}
