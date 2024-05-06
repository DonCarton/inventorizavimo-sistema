import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, useForm, usePage} from "@inertiajs/react";
import {useState} from "react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";

export default function CreateTwo({auth}) {
    const { roles } = usePage();
    const [activeTab, setActiveTab] = useState(1);
    const [selectedPrefix, setSelectedPrefix] = useState('');
    const prefixOptions = [
        { value: 'BIN', label: 'BIN' },
        { value: 'FIM', label: 'FIM' },
        { value: 'DIM', label: 'DIM' },
    ];
    const {data: formData, setData, post, processing, errors} = useForm({
        name: '',
        email: '',
        password: '',
        selectedRole: '',
    });

    const handlePrefixChange = (e) => {
        setSelectedPrefix(e.target.value);
    };

    const handleTabChange = (tabNumber) => {
        setActiveTab(tabNumber);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            ...formData,
            prefix_option_id: selectedPrefix,
        };
        await post('/tasks', postData);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold 4xl:text-2xl text-xl text-gray-800 dark:text-gray-200 leading-tight">Create new
                        item</h2>
                </div>
            }
        >
            <Head title="Create item"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mt-4">
                        <button className={activeTab === 1 ? 'active py-1 px-3 bg-blue-500' : 'py-1 px-3 bg-gray-400'} onClick={() => handleTabChange(1)}>Tab 1
                        </button>
                        <button className={activeTab === 2 ? 'active py-1 px-3 bg-blue-500' : 'py-1 px-3 bg-gray-400'} onClick={() => handleTabChange(2)}>Tab 2
                        </button>
                        <button className={activeTab === 3 ? 'active py-1 px-3 bg-blue-500' : 'py-1 px-3 bg-gray-400'} onClick={() => handleTabChange(3)}>Tab 3
                        </button>
                    </div>
                    {activeTab === 1 && (
                        <div className="mt-4">
                            <h2 className="4xl:text-2xl 3xl:text-xl">Pasirinkite kur bus laikomas inventorius</h2>
                            <select className="mt-1 block w-full" value={selectedPrefix} onChange={handlePrefixChange}>
                                <option value="">Select Prefix</option>
                                {prefixOptions.map((prefixOption) => (
                                    <option key={prefixOption.id} value={prefixOption.id}>{prefixOption.label}</option>
                                ))}
                            </select>
                            <button onClick={() => handleTabChange(2)}>Sekantis</button>
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="mt-4">
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="user_name"
                                    value="New user's name"
                                />
                                <TextInput
                                    id="user_name"
                                    type="text"
                                    name="local_name"
                                    value={formData.name}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={e => setData('name', e.target.value)}
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="user_email"
                                    value="New user's email"
                                />
                                <TextInput
                                    id="user_email"
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    className="mt-1 block w-full"
                                    onChange={e => setData('email', e.target.value)}
                                />
                                <InputError
                                    message={errors.email} className="mt-2"
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="user_password"
                                    value="New user's password"
                                />
                                <TextInput
                                    id="user_password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    className="mt-1 block w-full"
                                    onChange={e => setData('password', e.target.value)}
                                />
                            </div>
                            <h2>Inventoriaus aprašymas</h2>
                            {/* Form fields for task details */}
                            <button onClick={() => handleTabChange(1)}>Praeitas</button>
                            <button onClick={() => handleTabChange(3)}>Sekantis</button>
                        </div>
                    )}
                    {activeTab === 3 && (
                        <div className="mt-4">
                            <h2>Duomenų patikra prieš išsaugojimą</h2>
                            {/* Display the selected prefix and task details for review */}
                            <button onClick={() => handleTabChange(2)}>Praeitas</button>
                            <button onClick={handleSubmit} disabled={processing}>Išsaugoti</button>
                        </div>
                    )}
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
