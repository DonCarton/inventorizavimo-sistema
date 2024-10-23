import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import StringHelper from "@/Libs/StringHelper.jsx";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import {useState} from "react";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";

export default function Create({auth}) {
    const [checked, setChecked] = useState(false);
    const {data, setData, post, errors, processing} = useForm({
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
            can={auth.can}
            header={<h2
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Create")}</h2>}
        >
            <Head title={StringHelper.__("Create")}/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={onSubmit}>
                                <div className="mt-4">
                                    <InputLabel htmlFor="itemType_name">{StringHelper.__("Name")}<span
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
                                        {StringHelper.__("Can change literal amount")}?<span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="mt-4">
                                    <Link href="/itemTypes"><SecondaryButton>{StringHelper.__("Cancel")}</SecondaryButton></Link>
                                    <PrimaryButton className="ml-2" disabled={processing}>{StringHelper.__("Create")}</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
