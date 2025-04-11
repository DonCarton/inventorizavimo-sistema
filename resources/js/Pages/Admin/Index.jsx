import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm} from '@inertiajs/react';
import UpdateConfiguration from './Partials/UpdateConfiguration';
import FailureMessage from '@/Components/FailureMessage';
import Modal from '../../Components/Modal';
import React, {useEffect, useState} from "react";
import StringHelper from "@/Libs/StringHelper.jsx";
import InputError from "@/Components/InputError.jsx";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import SuccessMessage from "@/Components/SuccessMessage.jsx";
import {Transition} from "@headlessui/react";

export default function Index({ auth, myConfigurations, flash }) {
    const {data, setData, patch, errors, processing, clearErrors, recentlySuccessful} = useForm({
        value: '',
    })
    const [modalShown, setModalShown] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState(null);
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        const handleOutsideClick = (event) => {
            if (event.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        };

        if (selectedConfig) {
            document.addEventListener('keydown', handleEscapeKey);
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [modalShown, flash]);

    const loadModal = (config) => {
        setModalShown(true);
        setData('value', config.value.value);
        setSelectedConfig(config);
    };

    const closeModal = () => {
        setData('value','');
        setModalShown(false);
        setSelectedConfig(null);
        clearErrors();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('systemConfigurations.update', {systemConfiguration: selectedConfig.id}));
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">System configurations</h2>}
        >
            <Head title="System configurations"/>

            <div className="py-12">
                {flash.failure && <FailureMessage message={flash.failure}/>}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div>
                        {Object.keys(myConfigurations).map((category) => (
                            <div key={category} className="mt-2">
                                <section key={category} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                                    <header>
                                        <h2 className="xl:text-2xl lg:text-lg md:text-md text-lg font-bold text-gray-900 dark:text-gray-100">{StringHelper.__(category.charAt(0).toUpperCase() + category.slice(1) + " configurations")}</h2>
                                    </header>
                                    <ul className="mt-2">
                                        {myConfigurations[category].map((config) => (
                                            <li key={config.id} className="flex justify-between items-center p-2 border border-gray-200 rounded">
                                                <span className="font-medium">{config.name}:</span>
                                                <span
                                                    className="text-blue-500 underline cursor-pointer"
                                                    onClick={() => loadModal(config)}
                                                >
                                                    {config.value.value}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>
                        ))}
                    </div>
                    {selectedConfig && <Modal closeable={true} show={modalShown}>
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                            <h1 className="xl:text-xl lg:text-lg md:text-md font-bold mb-2">{StringHelper.__('Edit configuration')}</h1>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <div className="mb-4">
                                        <InputLabel className="md:text-base" htmlFor={"system-configuration-config-" + selectedConfig.key} value={selectedConfig.name + ":"}/>
                                        <TextInput id={"system-configuration-config-" + selectedConfig.key} className="mt-1 w-full" value={data.value} onChange={(e) => setData('value',e.target.value)} />
                                        <InputError message={errors.value} className="mt-2" />
                                    </div>
                                    <div className="flex justify-start space-x-2">
                                        {recentlySuccessful ?
                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            ><p className="text-sm text-gray-600 dark:text-gray-400">{StringHelper.__("Saved")}.</p>
                                            </Transition> : <PrimaryButton disabled={processing} type="submit">{StringHelper.__('Save')}</PrimaryButton>}
                                        <SecondaryButton type="button" onClick={closeModal}>{StringHelper.__('Close')}</SecondaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
