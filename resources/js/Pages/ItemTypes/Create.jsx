import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import {__} from '@/Libs/Lang.jsx';
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import Checkbox from "@/Components/Checkbox.jsx";
import {useState} from "react";

export default function Create({auth, role}) {
    const [checked, setChecked] = useState(false);
    const {data, setData, post, errors} = useForm({
        name: '',
        change_acc_amount: false
    })
    const onSubmit = (e) => {
        e.preventDefault();
        post(route('itemTypes.store'));
    }
    const handleCheckbox = (e) => {
        setData('change_acc_amount', e.target.checked);
        setChecked(e.target.checked);
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Create")}</h2>}
            role={role}
        >
            <Head title={__("Create")}/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={onSubmit}>
                                <div className="mt-4">
                                    <InputLabel htmlFor="itemType_name">{__("Name")}<span
                                        className="text-red-500">*</span></InputLabel>
                                    <TextInput id="itemType_name" type="text" name="name" value={data.name}
                                               className="mt-1 block w-full" isFocused={true}
                                               onChange={e => setData('name', e.target.value)}/>
                                    <InputError message={errors.name} className="mt-2"/>
                                </div>
                                <div className="mt-4">
                                    <label>
                                        <input
                                            className="mr-2 rounded w-6 h-6"
                                            type="checkbox"
                                            checked={checked}
                                            onChange={handleCheckbox}
                                        />
                                        {__("Can change literal amount")}?<span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="mt-4">
                                    <Link href={route('itemTypes.index')}
                                          className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">
                                        {__("Cancel")}
                                    </Link>
                                    <button
                                        className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                                        {__("Save")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
