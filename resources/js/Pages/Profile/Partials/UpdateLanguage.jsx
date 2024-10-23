import {useForm} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";
import {useState} from "react";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {Transition} from "@headlessui/react";

export default function UpdateLanguage({className = '', language}) {
    const [languagePref, setLanguagePref] = useState(language);
    const {
        setData,
        patch,
        processing,
        recentlySuccessful,
    } = useForm({
        locale: languagePref || '',
    });

    const setLanguage = (e) => {
        setLanguagePref(e.target.value);
        setData('locale', e.target.value);
    }
    const updateLanguage = (e) => {
        e.preventDefault();

        patch(route('profile.updateLanguage'), {
            preserveScroll: true
        });
    };
    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{StringHelper.__("Change language")}</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {StringHelper.__("With the below setting you can change the language of the whole system")}.
                </p>
            </header>

            <form onSubmit={updateLanguage} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="language" value={StringHelper.__("Language")}/>

                    <select className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm" id="language" onChange={setLanguage} value={languagePref}>
                        <option id="1" value="en">{StringHelper.__("English")}</option>
                        <option id="2" value="lt">{StringHelper.__("Lithuanian")}</option>
                    </select>
                </div>
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
    );
}
