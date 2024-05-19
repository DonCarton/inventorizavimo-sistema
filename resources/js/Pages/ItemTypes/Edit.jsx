import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import {__} from '@/Libs/Lang.jsx';
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import {useState} from "react";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function Edit({ auth, itemType, role, previousUrl }) {
    const [previousUrlPage] = useState(previousUrl);
    const [checked, setChecked] = useState(itemType.data.change_acc_amount);
    const {data, setData, put, errors, processing} = useForm({
        name: itemType.data.name || '',
        change_acc_amount: itemType.data.change_acc_amount,
    })
    const onSubmit = (e) => {
        e.preventDefault();
        put(route('itemTypes.update', itemType.data.id));
    }
    const handleCheckbox = (e) => {
        setData('change_acc_amount', e.target.checked);
        setChecked(e.target.checked);
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Edit")} - {itemType.data.name}</h2>}
            role={role}
        >
            <Head title={__("Edit") + " - " + itemType.data.name} />
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
                                    <InputError message={errors.change_acc_amount} className="mt-2"/>
                                </div>
                                <div className="mt-4">
                                    <Link href={previousUrlPage}
                                          className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        {__("Cancel")}
                                    </Link>
                                    <PrimaryButton className="ml-2" disabled={processing}>{__("Save")}</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
