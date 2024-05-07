import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
// import Select from "react-tailwindcss-select";
import react, {useState} from "react";
import SteamDropdown from "@/Components/SteamDropdown.jsx"
import Select from "react-select";

export default function Create({auth, roles}) {

    const [selectedOption, setSelectedOption] = useState(null);
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ];
    const {data, setData, post, errors} = useForm({
        name: '',
        email: '',
        password: '',
        selectedRole: '',
        selectedAnimal: '',
    });

    const setAnimalValue = (e) => {
        setAnimal(e.target.value);
    }

    const handleChange = value => {
        console.log("value:", value);
        setAnimal(value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create new
                        user</h2>
                </div>
            }
        >
            <Head title="Inventory items"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/*<div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">*/}
                    {/*<Select options={options} value={animal} onChange={handleChange} isMultiple={true} primaryColor={"indigo"}/>*/}
                    <Select
                        defaultValue={selectedOption}
                        onChange={setSelectedOption}
                        options={options}
                        isMulti
                        isClearable={true}
                        classNames={{
                            control: (state) =>
                                state.isFocused ? 'border-red-600' : 'border-grey-300',
                        }}
                    />
                        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="user_name"
                                    value="New user's name"
                                />
                                <TextInput
                                    id="user_name"
                                    type="text"
                                    name="local_name"
                                    value={data.name}
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
                                    value={data.email}
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
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    onChange={e => setData('password', e.target.value)}
                                />
                            </div>
                            <div className="mt-4 mb-2">
                                <InputLabel
                                    htmlFor="user_role"
                                    value="New user's role"
                                />
                                <div>
                                    <SteamDropdown
                                        name="roles"
                                        //value={data.selectedRole}
                                        onChange={e => setData('selectedRole', e.target.value)}
                                        options={roles}
                                        className="mt-1 block w-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <Link href={route('users.index')}
                                      className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                                >
                                    Cancel
                                </Link>
                                <button
                                    className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                                    Create
                                </button>
                            </div>
                        </form>
                    {/*</div>*/}
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
