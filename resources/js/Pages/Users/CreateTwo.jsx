import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, useForm, usePage} from "@inertiajs/react";
import {useState} from "react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import {Button, Step, Stepper} from "@material-tailwind/react";

export default function CreateTwo({auth}) {
    const { roles } = usePage();
    const [activeStep, setActiveStep] = useState(0);
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    const [selectedPrefix, setSelectedPrefix] = useState('BIN');
    const [postNumber, setPostNumber] = useState(null);
    const [disabledSecondStep, setDisabledSecondStep] = useState(true);
    const prefixOptions = [
        { value: 'BIO', label: 'BIO' },
        { value: 'CHE', label: 'CHE' },
        { value: 'FIZ', label: 'FIZ' },
        { value: 'FAB', label: 'FAB' },
        { value: 'PRO', label: 'PRO' },
        { value: 'ROB', label: 'ROB' },
        { value: 'SVI', label: 'SVI' },
        { value: 'INZ', label: 'INZ' },
        { value: 'BEN', label: 'BEN' },
    ];
    const {data: formData, setData, post, processing, errors} = useForm({
        local_name: postNumber,
        name: '',
        name_eng: '',
    });

    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    // const handlePrefixChange = (e) => {
    //     setSelectedPrefix(e.target.value);
    // };

    const handlePrefixChange = async (e) => {
        const prefixId = e.target.value;
        setSelectedPrefix(prefixId);
        try {
            //const response = await axios.post('/inventoryItems/fetch-post-number', { prefix_option_id: prefixId });
            const response = await axios.post('/inventoryItems/general-identifier', { prefix_option_id: prefixId });
            const { post_number } = response.data;
            setPostNumber(post_number);
            formData.local_name = postNumber;
            setActiveTab(2);
            setDisabledSecondStep(false);
        } catch (error) {
            console.error('Error fetching post number:', error.message);
        }
    };

    const handleTabChange = (tabNumber) => {
        if(!disabledSecondStep){
            setDisabledSecondStep(true)
        }
        setActiveTab(tabNumber);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        alert('Išsaugota');
        // const postData = {
        //     ...formData,
        //     prefix_option_id: selectedPrefix,
        //     post_number: postNumber
        // };
        // await post('/tasks', postData);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold 4xl:text-2xl text-xl text-gray-800 dark:text-gray-200 leading-tight">Create new item</h2>
                </div>
            }
        >
            <Head title="Create item"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {postNumber && (
                        <p>Next Post Number: {postNumber}</p>
                    )}
                    {activeTab === 1 && (
                        <div className="mt-4">
                            <h2 className="4xl:text-2xl 3xl:text-xl">Pasirinkite kur bus laikomas inventorius</h2>
                            <select className="mt-1 block w-full" value={selectedPrefix} onChange={handlePrefixChange}>
                                <option value="">Select Prefix</option>
                                {prefixOptions.map((prefixOption) => (
                                    <option key={prefixOption.id} value={prefixOption.id}>{prefixOption.label}</option>
                                ))}
                            </select>
                            <div className="flex float-right mt-2">
                                <button onClick={() => handleTabChange(2)}
                                        className="bg-blue-500 rounded px-1 py-3">Sekantis
                                </button>
                            </div>
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="mt-4">
                            <h2>Inventoriaus aprašymas</h2>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="item_local_name"
                                    value="New item's local name"
                                />
                                <TextInput
                                    id="item_local_name"
                                    type="text"
                                    name="local_name"
                                    value={postNumber}
                                    className="mt-1 block w-full bg-gray-400"
                                    disable="true"
                                    onChange={e => setData('local_name', e.target.value)}
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="item_name"
                                    value="New item's name"
                                />
                                <TextInput
                                    id="item_name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    className="mt-1 block w-full"
                                    onChange={e => setData('name', e.target.value)}
                                />
                                <InputError
                                    message={errors.email} className="mt-2"
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="item_name_eng"
                                    value="New item's name in English"
                                />
                                <TextInput
                                    id="item_name_eng"
                                    type="text"
                                    name="name_eng"
                                    value={formData.name_eng}
                                    className="mt-1 block w-full"
                                    onChange={e => setData('name_eng', e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between mt-2">
                                <button onClick={() => handleTabChange(1)}
                                        className="bg-blue-500 rounded px-1 py-3 mr-2 hover:bg-blue-600">Praietas
                                </button>
                                <button onClick={handleSubmit} disabled={processing}
                                        className="bg-emerald-600 rounded px-1 py-3 hover:bg-emerald-700">Išsaugoti
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
