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
        { value: 'BIN', label: 'BIN' },
        { value: 'FIM', label: 'FIM' },
        { value: 'DIM', label: 'DIM' },
        { value: 'INZ', label: 'INZ' },
        { value: 'BEN', label: 'BEN' },
    ];
    const {data: formData, setData, post, processing, errors} = useForm({
        local_name: postNumber,
        name: '',
        email: '',
        password: '',
        selectedRole: '',
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
        const postData = {
            ...formData,
            prefix_option_id: selectedPrefix,
            post_number: postNumber
        };
        await post('/tasks', postData);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold 4xl:text-2xl text-xl text-gray-800 dark:text-gray-200 leading-tight">Create
                        new
                        item</h2>
                </div>
            }
        >
            <Head title="Create item"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1>Create Post</h1>
                    <select value={selectedPrefix} onChange={handlePrefixChange}>
                        {/*<option value="">Select Prefix</option>*/}
                        {prefixOptions.map((prefixOption) => (
                            <option key={prefixOption.id} value={prefixOption.id}>{prefixOption.label}</option>
                        ))}
                    </select>
                    {postNumber && (
                        <p>Next Post Number: {postNumber}</p>
                    )}
                    <div className="w-full py-4 px-8 bg-black">
                        <Stepper lineClassName="bg-white/50" activeLineClassName="bg-white" activeStep={activeStep}
                                 isLastStep={(value) => setIsLastStep(value)}
                                 isFirstStep={(value) => setIsFirstStep(value)}>
                            <Step className={activeStep === 0 ? "h-4 w-4 !bg-blue-500" : "h-4 w-4 !bg-blue-300"}
                                  onClick={() => {setActiveStep(0);handleTabChange(1);}}/>
                            <Step className={activeStep === 1 ? "h-4 w-4 !bg-blue-500" : "h-4 w-4 !bg-blue-300"}
                                  onClick={() => {setActiveStep(1);handleTabChange(2)}}/>
                            <Step className={activeStep === 2 ? "h-4 w-4 !bg-blue-500" : "h-4 w-4 !bg-blue-300"}
                                  onClick={() => {setActiveStep(2);handleTabChange(3)}}/>
                        </Stepper>
                        <div className="mt-16 flex justify-between">
                            <Button
                                className={activeStep === 1 || activeStep === 2 ? 'py-1 px-3 bg-blue-500' : 'py-1 px-3 bg-gray-400'}
                                onClick={handlePrev} disabled={isFirstStep}>
                                Prev
                            </Button>
                            <Button
                                className={activeStep === 0 || activeStep === 1 ? 'py-1 px-3 bg-blue-500' : 'py-1 px-3 bg-gray-400'}
                                onClick={handleNext} disabled={isLastStep}>
                                Next
                            </Button>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button className={activeTab === 1 ? 'active py-1 px-3 bg-blue-500' : 'py-1 px-3 bg-gray-400'}
                                onClick={() => handleTabChange(1)}>Tab 1
                        </button>
                        <button className={activeTab === 2 ? 'active py-1 px-3 bg-blue-500' : 'py-1 px-3 bg-gray-400'} disabled={disabledSecondStep}
                                onClick={() => handleTabChange(2)}>Tab 2
                        </button>
                        <button className={activeTab === 3 ? 'active py-1 px-3 bg-blue-500' : 'py-1 px-3 bg-gray-400'}
                                onClick={() => handleTabChange(3)}>Tab 3
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
