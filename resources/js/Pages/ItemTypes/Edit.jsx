import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm} from "@inertiajs/react";
import {__} from '@/Libs/Lang.jsx';
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";

export default function Edit({ auth, itemType, role }) {
    const {data, setData, put, errors} = useForm({
        name: itemType.data.name || '',
    })
    const onSubmit = (e) => {
        e.preventDefault();
        put(route('itemTypes.update'));
    }
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
                            {/*<pre> {JSON.stringify(itemType, undefined, 2)} </pre>*/}
                            <form onSubmit={onSubmit}>
                                <div className="mt-4">
                                    <InputLabel htmlFor="itemType_name" value={__("Name")}/>
                                    <TextInput id="itemType_name" type="text" name="name" value={data.name} className="mt-1 block w-full" isFocused={true} onChange={e => setData('name', e.target.value)}/>
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div className="mt-4">
                                    <Link href={route('itemTypes.index')} className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">
                                        Cancel
                                    </Link>
                                    <button className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                                        Save
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
