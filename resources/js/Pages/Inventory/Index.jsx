import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm, router} from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";
import {useState} from "react";
import InputLabel from "@/Components/InputLabel.jsx";
import Modal from "@/Components/Modal.jsx";
import {__} from "@/Libs/Lang.jsx";
import TextInput from "@/Components/TextInput.jsx";
import TableHeader from "@/Components/TableHeader.jsx";
import DeleteTextOrIcon from "@/Components/DeleteTextOrIcon.jsx";
import {RiDeleteBin6Line, RiFileExcel2Line} from 'react-icons/ri';
import {TbEdit, TbTablePlus} from "react-icons/tb";
import InformationIconToolTip from "@/Components/InformationIconToolTip.jsx";

export default function Index({auth, inventoryItems, role, queryParams = null, success}) {
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
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === 'asc') {
                queryParams.sort_direction = 'desc';
            } else {
                queryParams.sort_direction = 'asc';
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route('inventoryItems.index'), queryParams);
    }
    const handleDelete = (e) => {
        router.delete('inventoryItems.destroy.destroy', e.target.value);
    }
    const handleDestory = (value) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            router.delete(route('inventoryItems.destroy', value), {preserveScroll: true})
        }
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
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Inventory")}</h2>
                        <InformationIconToolTip
                            content={__("Here you can view all the available inventory items") + '.'}
                            placement="right-end" classname="bg-black" color="black"
                            classnameForIcon="w-5 h-5 ml-1 mt-1"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <a href={route("export")} target="_blank"><RiFileExcel2Line
                            className="w-10 h-10 text-emerald-600 hover:text-emerald-900 hover:rounded hover:bg-gray-50 hover:animate-pulse"/></a>
                        <a href={route("inventoryItems.create")}><TbTablePlus
                            className="w-10 h-10 text-black hover:text-gray-700 hover:rounded hover:bg-gray-50 hover:animate-pulse"/></a>
                        {/*<Link href={route("inventoryItems.create")}*/}
                        {/*      className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"> {__("Create")}*/}
                        {/*</Link>*/}
                    </div>
                </div>
            }
            role={role}
        >
            <Head title="Inventory items"/>
            {success && <div className="bg-emerald-500 py-2 px-4 text-black rounded">{success} </div>}
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
                                            <td className="flex justify-start mt-1 px-2 py-1">
                                                {/*<Link href={route("inventoryItems.edit", inventoryItem.id)}*/}
                                                {/*      className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1"*/}
                                                {/*>*/}
                                                {/*    {__("Edit")}*/}
                                                {/*</Link>*/}
                                                {/*<Link href={route("editAmount", inventoryItem.id)}*/}
                                                {/*      className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1"*/}
                                                {/*>*/}
                                                {/*    {__("Edit")} 2*/}
                                                {/*</Link>*/}

                                                {/*<a href={route('inventoryItems.show', inventoryItem.id)}><ShowEditOrIcon textValue={__("Show")}/></a>*/}
                                                {/*<a href={route('inventoryItems.edit', inventoryItem.id)}><EditTextOrIcon textValue={__("Edit")}/></a>*/}
                                                <Link href={route("inventoryItems.edit", inventoryItem.id)}
                                                      className="font-medium text-green-500 dark:text-green-400 hover:underline mx-1">
                                                    <TbEdit
                                                        className="w-6 h-6 text-emerald-500 hover:text-emerald-700 hover:animate-pulse hover:bg-gray-50"/>
                                                </Link>
                                                <a type="button"
                                                   onClick={() => handleDestory(inventoryItem.id)}><RiDeleteBin6Line
                                                    className="w-6 h-6 text-red-500 hover:text-red-700 hover:animate-pulse hover:bg-gray-50"/></a>
                                                {/*<a href={route('inventoryItems.edit', inventoryItem.id)}><DeleteTextOrIcon*/}
                                                {/*    textValue={__("Delete")}/></a>*/}
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
