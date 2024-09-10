import InputError from '@/Components/InputError';
import InputLabel from '@/Components/Forms/InputLabel.jsx';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import StringHelper from '@/Libs/StringHelper';

export default function UpdateEmailConfigurations({ className = '', configurations }) {

    const { data, setData, put, processing, errors } = useForm({
        configurations: configurations.reduce((acc, config) => {
            acc[config.key] = config.string_value || config.boolean_value || config.integer_value;
            return acc;
        }, {})
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('systemConfigurations.update'), {
            data: data.configurations,
            preserveScroll: true,
        });
    };
    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{StringHelper.__("Email configuration for the system")}</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {StringHelper.__("Update the email related objects for the system")}.
                </p>
            </header>
            <form onSubmit={submit}>
            {configurations.map((config) => (
                <div key={config.id} className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200">{config.name}</label>
                    <input
                        type="text"
                        className="mt-1 block w-full"
                        value={data[config.key] || ''}
                        onChange={(e) => setData(config.key, e.target.value)}
                    />
                    {errors[config.key] && <div className="text-red-500">{errors[config.key]}</div>}
                </div>
            ))}

            <button type="submit" className="mt-4 btn btn-primary" disabled={processing}>
                Save
            </button>
            </form>
        </section>
    )
}
