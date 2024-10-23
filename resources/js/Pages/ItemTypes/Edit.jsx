import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, router, useForm} from "@inertiajs/react";
import StringHelper from "@/Libs/StringHelper.jsx";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import React, {useState} from "react";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import {RiDeleteBin6Line} from "react-icons/ri";

export default function Edit({ auth, itemType }) {
    const handleConfirmMessage = StringHelper.__("Are you sure you want to delete this item") + '?';
    const [checked, setChecked] = useState(itemType.data.changeAccAmount);
    const {data, setData, put, errors, processing} = useForm({
        name: itemType.data.name || '',
        change_acc_amount: itemType.data.changeAccAmount || false,
    })
    const onSubmit = (e) => {
        e.preventDefault();
        put(route('itemTypes.update', itemType.data.id));
    }
    const handleCheckbox = (e) => {
        setData('change_acc_amount', e.target.checked);
        setChecked(e.target.checked);
    };
    const handleDestroy = (value) => {
        if (window.confirm(handleConfirmMessage)) {
            router.delete(route('itemTypes.destroy', value), {
                preserveScroll: true
            })
        }
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Edit")} - {itemType.data.name}</h2>}
        >
            <Head title={StringHelper.__("Edit") + " - " + itemType.data.name} />
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
                                    <InputError message={errors.change_acc_amount} className="mt-2"/>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <div>
                                        <Link href="/itemTypes"><SecondaryButton
                                            type="button">{StringHelper.__("Cancel")}</SecondaryButton></Link>
                                        <PrimaryButton className="ml-2"
                                                       disabled={processing}>{StringHelper.__("Save")}</PrimaryButton>
                                    </div>
                                    <button type="button" onClick={() => handleDestroy(itemType.data.id)}
                                            className="inline-flex items-center px-4 py-2 bg-pink-500 dark:bg-pink-500 border border-pink-500 hover:border-pink-800 dark:border-pink-500 rounded-md font-semibold text-xs text-white dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-rose-800 dark:hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150">{StringHelper.__("Delete")}<RiDeleteBin6Line
                                        className="ml-1 w-5 h-5 text-white"/>
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
