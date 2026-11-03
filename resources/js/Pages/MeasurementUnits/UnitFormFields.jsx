import InputLabel from "@/Components/Forms/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import StringHelper from "@/Libs/StringHelper.jsx";

// Fields shared by the Create and Edit unit pages.
export default function UnitFormFields({data, setData, errors}) {
    return (
        <>
            <div className="mt-4">
                <InputLabel htmlFor="measurementUnit_code">{StringHelper.__("Code")}<span className="text-red-500">*</span></InputLabel>
                <TextInput id="measurementUnit_code" type="text" name="code" value={data.code} maxLength={3}
                           className="mt-1 block w-full uppercase" isFocused={true}
                           onChange={e => setData('code', e.target.value.toUpperCase())}/>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {StringHelper.__("1 to 3 uppercase letters, used at the end of item codes (e.g. ŠVIE102-K)")}.
                </p>
                <InputError message={errors.code} className="mt-2"/>
            </div>
            <div className="mt-4">
                <InputLabel htmlFor="measurementUnit_name">{StringHelper.__("Name")}<span className="text-red-500">*</span></InputLabel>
                <TextInput id="measurementUnit_name" type="text" name="name" value={data.name}
                           className="mt-1 block w-full"
                           onChange={e => setData('name', e.target.value)}/>
                <InputError message={errors.name} className="mt-2"/>
            </div>
            <div className="mt-4">
                <InputLabel htmlFor="measurementUnit_decimal_places">{StringHelper.__("Decimal places")}<span className="text-red-500">*</span></InputLabel>
                <select id="measurementUnit_decimal_places" name="decimal_places" value={data.decimal_places}
                        onChange={e => setData('decimal_places', Number(e.target.value))}
                        className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full">
                    <option value={0}>0 - {StringHelper.__("whole numbers only")}</option>
                    <option value={1}>1 (0.1)</option>
                    <option value={2}>2 (0.01)</option>
                    <option value={3}>3 (0.001)</option>
                </select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {StringHelper.__("Applies to new amounts, existing amounts are not changed")}.
                </p>
                <InputError message={errors.decimal_places} className="mt-2"/>
            </div>
            <div className="mt-4">
                <label>
                    <input className="mr-2 rounded w-6 h-6" type="checkbox" checked={data.is_active}
                           onChange={e => setData('is_active', e.target.checked)}/>
                    {StringHelper.__("Active")}
                </label>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {StringHelper.__("Inactive units can't be chosen for new items, existing items keep them")}.
                </p>
                <InputError message={errors.is_active} className="mt-2"/>
            </div>
        </>
    );
}
