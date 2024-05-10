import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm, router} from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import {useState} from "react";
import InputLabel from "@/Components/InputLabel.jsx";
import Modal from "@/Components/Modal.jsx";
import {__} from "@/Libs/Lang.jsx";
import TextInput from "@/Components/TextInput.jsx";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid/index.js";
import TableHeader from "@/Components/TableHeader.jsx";

export default function Index({auth, inventoryItems, queryParams = null}) {
    queryParams = queryParams || {};
    const [isOpen, setIsOpen] = useState(false)
    const {setData, get} = useForm({prefix: '',});
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('inventoryItems.index'), queryParams);
    }
    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;
        searchFieldChanged(name, e.target.value);
    }
    const sortChanged = (name) => {
        if (name === queryParams.sort_field){
            if(queryParams.sort_direction === 'asc'){
                queryParams.sort_direction = 'desc';
            }else {
                queryParams.sort_direction = 'asc';
            }
        }else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route('inventoryItems.index'), queryParams);
    }
    const handleClose = (e) => {
        e.preventDefault();
        setIsOpen(false);
        get(route('users.create'));
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Inventory
                        items</h2>
                    <div>
                        <a href={route("export")} target="_blank"
                           className="bg-amber-600 py-1 px-3 mr-2 text-white rounded shadow transition-all hover:bg-amber-700">{__("Export to Excel")}</a>
                        {/*<button onClick={handleOpen} className="bg-gray-400 py-1 px-3 text-white rounded shadow transition-all mr-2 hover:bg-gray-600">Su modal'u</button>*/}
                        <Link href={route("inventoryItems.create")}
                              className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"> {__("Create")}
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Inventory items"/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <Modal
                            show={isOpen}
                            closeable={true}
                        >
                            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                <form onSubmit={handleClose}>
                                    <div className="mt-4">
                                        <InputLabel
                                            htmlFor="location_choice"
                                            value="New inventory item"
                                        />
                                        {/*<select value={chosenValue} onChange={e => setChosenValue(e.target.value)}>*/}
                                        <select onChange={e => setData('prefix', e.target.value)} className="mb-2">
                                            <option value="">No option</option>
                                            <option value="BIO">BIO</option>
                                            <option value="CHE">CHE</option>
                                            <option value="FIZ">FIZ</option>
                                            <option value="FAB">FAB</option>
                                            <option value="PRO">PRO</option>
                                            <option value="ROB">ROB</option>
                                            <option value="SVI">SVI</option>
                                            <option value="INZ">INZ</option>
                                            <option value="BEN">BEN</option>
                                        </select>
                                        <button
                                            className="bg-emerald-600 px-1 py-3 rounded shadow hover:bg-emerald-700">Tęsti
                                            prie kūrimo
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Modal>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/*<pre>{JSON.stringify(inventoryItems, undefined, 2)}</pre>*/}
                            <div className="overflow-auto">
                                <table
                                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2">ID</th>
                                        <TableHeader
                                            name="local_name"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                            children={__("Barcode")}
                                        />
                                        <TableHeader
                                            name="name"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                            children={__("Name")}
                                        />
                                        <th className="px-3 py-2">{__("Name ENG")}</th>
                                        <TableHeader
                                            name="updated_at"
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                            children={__("Updated at")}
                                        />
                                        <th className="px-3 py-2">{__("Created by")}</th>
                                        <th className="px-3 py-2">{__("Updated by")}</th>
                                        <th className="px-3 py-2">{__("Actions")}</th>
                                    </tr>
                                    </thead>
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2">
                                            <TextInput
                                                className="w-full text-sm"
                                                defaultValue={queryParams.local_name}
                                                placeholder={__("Barcode")}
                                                onBlur={e => searchFieldChanged('local_name', e.target.value)}
                                                onKeyPress={e => onKeyPress('local_name', e)}
                                            />
                                        </th>
                                        <th className="px-3 py-2">
                                            <TextInput
                                                className="w-full text-sm"
                                                defaultValue={queryParams.name}
                                                placeholder={__("Name")}
                                                onBlur={e => searchFieldChanged('name', e.target.value)}
                                                onKeyPress={e => onKeyPress('name', e)}/>
                                        </th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2">
                                            <TextInput className="w-full text-sm" placeholder={__("Updated by")}
                                                       defaultValue={queryParams.updated_by}
                                                       onBlur={e => searchFieldChanged('updated_by', e.target.value)}
                                                       onKeyPress={e => onKeyPress('updated_by', e)}/>
                                        </th>
                                        <th className="px-3 py-2"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {inventoryItems.data.map(inventoryItem => (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th className="px-3 py-2">{inventoryItem.id}</th>
                                            <td className="px-3 py-2">{inventoryItem.local_name}</td>
                                            <td className="px-3 py-2">{inventoryItem.name}</td>
                                            <td className="px-3 py-2">{inventoryItem.name_eng}</td>
                                            <td className="px-3 py-2">{inventoryItem.updated_at}</td>
                                            <td className="px-3 py-2">{inventoryItem.created_by.email}</td>
                                            <td className="px-3 py-2">{inventoryItem.updated_by.email}</td>
                                            <td className="px-3 py-2">
                                                <Link href={route("inventoryItems.edit", inventoryItem.id)}
                                                      className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1"
                                                >
                                                    {__("Edit")}
                                                </Link>
                                                <Link href={route("editAmount", inventoryItem.id)}
                                                      className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1"
                                                >
                                                    {__("Edit")} 2
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={inventoryItems.meta.links}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
