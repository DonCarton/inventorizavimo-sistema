import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link} from "@inertiajs/react";
import StringHelper from "@/Libs/StringHelper.jsx";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import MiscButton from "@/Components/Forms/MiscButton.jsx";
import {TbEdit} from "react-icons/tb";

// Read-only details of a measurement unit. Everyone who can see the units list gets
// this page; the Edit button only shows for users who may change units.
export default function Show({auth, measurementUnit, can = {}}) {
    const unit = measurementUnit.data;
    const readOnlyClass = "mt-1 block w-full disabled:text-white disabled:bg-gray-400";

    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Show")} - {unit.code}</h2>
                    {can.update && (
                        <MiscButton classVariant="green" title={StringHelper.__("Edit")} as="link"
                                    to={route("measurementUnits.edit", unit.id)} icon={TbEdit} children={StringHelper.__("Edit")}/>
                    )}
                </div>
            }
        >
            <Head title={StringHelper.__("Show") + " - " + unit.code}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                                <div className="mt-4">
                                    <InputLabel htmlFor="measurementUnit_code">{StringHelper.__("Code")}</InputLabel>
                                    <TextInput id="measurementUnit_code" type="text" value={unit.code}
                                               className={readOnlyClass} disabled={true} readOnly={true}/>
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="measurementUnit_name">{StringHelper.__("Name")}</InputLabel>
                                    <TextInput id="measurementUnit_name" type="text" value={unit.name}
                                               className={readOnlyClass} disabled={true} readOnly={true}/>
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="measurementUnit_decimal_places">{StringHelper.__("Decimal places")}</InputLabel>
                                    <TextInput id="measurementUnit_decimal_places" type="text"
                                               value={unit.decimalPlaces === 0 ? `0 — ${StringHelper.__("whole numbers only")}` : String(unit.decimalPlaces)}
                                               className={readOnlyClass} disabled={true} readOnly={true}/>
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="measurementUnit_items">{StringHelper.__("Items")}</InputLabel>
                                    <TextInput id="measurementUnit_items" type="text" value={String(unit.itemCount ?? 0)}
                                               className={readOnlyClass} disabled={true} readOnly={true}/>
                                </div>
                                <div className="mt-4">
                                    <label className="inline-flex items-center">
                                        <input type="checkbox" checked={Boolean(unit.isActive)} disabled={true}
                                               className="mr-2 rounded w-6 h-6 disabled:text-white disabled:bg-gray-400"/>
                                        {StringHelper.__("Active")}
                                    </label>
                                </div>
                            </div>
                            <div className="mt-6">
                                <Link href={route("measurementUnits.index")}
                                      className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                                    {StringHelper.__("Back")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
