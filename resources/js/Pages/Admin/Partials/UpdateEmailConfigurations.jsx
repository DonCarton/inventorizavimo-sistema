import InputError from '@/Components/InputError';
import InputLabel from '@/Components/Forms/InputLabel.jsx';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import StringHelper from '@/Libs/StringHelper';

export default function UpdateEmailConfigurations({ className = '', arrayOfData }) {

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        amount_notification: '',
        general_email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };
    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{StringHelper.__("Email configuration for the system")}</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {StringHelper.__("Update your account's profile first and last name")}.
                </p>
            </header>
            <form onSubmit={submit} className="mt-6 space-y-6">
                {
                    arrayOfData.map(entry => (
                        <div key={entry.key}>
                            <InputLabel htmlFor={entry.key} value={entry.name} />
                            <TextInput id={entry.key} className="mt-1 block w-full" value={entry.value} onChange={(e) => setData(entry.key, e.target.value)} required />
                            <InputError message={errors.key} />
                        </div>
                        )
                    )
                }

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
