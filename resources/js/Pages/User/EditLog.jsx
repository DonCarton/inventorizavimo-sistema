import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import Icon from "@/Components/Icon.jsx";
import InputError from "@/Components/InputError.jsx";
import {Accordion, AccordionBody, AccordionHeader} from "@material-tailwind/react";
import {useState} from "react";
import {__} from "@/Libs/Lang.jsx";
import Modal from "@/Components/Modal.jsx";
import { actionsOnInventory } from '@/Configurations/SelectConfigurations.jsx';
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function Edit({auth, inventoryItem, role, logsForItem, laboratories}) {
    const [actionFromUser, setActionFromUser] = useState('REMOVE');
    const {data, setData, patch, errors} = useForm({
        total_amount: inventoryItem.data.total_amount,
        laboratory_id: '',
        action: actionFromUser,
        amount: '',
        comment: '',
    })
    const [modalOpen, setModalOpen] = useState(false);
    const inventoryTypeDetails = inventoryItem.data.inventory_type;
    const [open, setOpen] = useState(1);
    const [open2, setOpen2] = useState(0);
    const [labInfo, setLabInfo] = useState([]);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    const handleOpen2 = (value) => setOpen2(open2 === value ? 0 : value);
    const onSubmit = (e) => {
        e.preventDefault();
        patch(route('inventoryItems.takeOutAmountLog', inventoryItem.data.id));
    }
    const onSubmit2 = (e) => {
        e.preventDefault();
        // setModalOpen(false);
        patch(route('inventoryItems.takeOutAmountLog', inventoryItem.data.id));
    }
    const closeModal = (e) =>{
        setModalOpen(false);
    }
    const openModal = (e) =>{
        setModalOpen(true);
    }
    const handleActionChange = (e) =>{
        setActionFromUser(e.target.value);
    }
    const handleNumericInput = (e) => {
        if (e.which < 48 || e.which > 57) {
            e.preventDefault();
        }
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Change amount")} - {inventoryItem.data.local_name} - {inventoryItem.data.name}</h2>
                </div>
            }
            role={role}
        >
            <Head title={__("Change amount") + ' - ' + inventoryItem.data.local_name}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg space-y-6">
                        <Modal closeable="sm" show={modalOpen} onClose={closeModal}>
                            <form className="p-6" onSubmit={onSubmit2}>
                                <div className="grid grid-cols-2 gap-x-6">
                                    <div className="mt-4">
                                        <InputLabel htmlFor="inventoryItems_laboratory_id">{__("Laboratory")}<span className="text-red-500">*</span></InputLabel>
                                        <select className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full" value={data.laboratory_id} onChange={e => setData('laboratory_id',e.target.value)}>
                                            <option value="">{__("Choose a value")}</option>
                                            {laboratories.data.map(laboratory => (
                                                <option value={laboratory.id}>{laboratory.name}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.laboratory_id} className="mt-2"/>
                                    </div>
                                    <div className="mt-4">
                                        <InputLabel htmlFor="inventoryItems_action">{__("Action")}<span
                                            className="text-red-500">*</span></InputLabel>
                                        <select className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full" onChange={e => setData('action',e.target.value)} value={data.action}>
                                            {actionsOnInventory.map(action => (
                                                <option value={action.value}>{__(action.label)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mt-4">
                                        <InputLabel htmlFor="inventoryItems_amount">{__("Amount")}<span
                                            className="text-red-500">*</span></InputLabel>
                                        <TextInput className="mt-1 block w-full" id="inventoryItems_amount" name="amount" onChange={e => setData('amount', e.target.value)} onKeyPress={handleNumericInput}></TextInput>
                                        <InputError message={errors.amount} className="mt-2"/>
                                    </div>
                                    <div className="mt-4">
                                        <InputLabel htmlFor="inventoryItems_comment">{__("Comment")}</InputLabel>
                                        <TextInput className="mt-1 block w-full" id="inventoryItems_comment" name="comment" onChange={e => setData('comment', e.target.value)}></TextInput>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    {/*<a className="px-3 py-1 bg-emerald-500 hover:bg-emerald-700 hover:cursor-pointer mr-2" onClick={closeModal}>Close the modal</a>*/}
                                    <SecondaryButton className="hover:bg-gray-100 mr-2" onClick={closeModal}>{__("Cancel")}</SecondaryButton>
                                    <PrimaryButton className="bg-emerald-700">{__("Save")}</PrimaryButton>
                                </div>
                            </form>
                        </Modal>
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="flex justify-end">
                                <button className="bg-amber-300 rounded border shadow p-2 hover:bg-amber-400" onClick={openModal}>Open modal</button>
                            </div>
                            <div className="pr-6 pl-6 pb-6">
                                <Accordion open={open === 1} icon={<Icon id={1} open={open}/>}>
                                    <AccordionHeader onClick={() => handleOpen(1)}>{__("Amount")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4 w-full">
                                                <InputLabel htmlFor="inventoryItems_total_amount" value={__("Count")}/>
                                                <TextInput id="inventoryItems_total_amount" type="text"
                                                           name="total_amount" value={data.total_amount}
                                                           className="mt-1 block w-full disabled:bg-gray-400 text-white"
                                                           readOnly={true} disabled={true}/>
                                            </div>
                                            <div className="mt-4 w-full">
                                                <InputLabel htmlFor="inventoryItems_critical_amount"
                                                            value={__("Critical amount")}/>
                                                <TextInput id="inventoryItems_critical_amount" type="text"
                                                           name="critical_amount"
                                                           value={inventoryItem.data.critical_amount}
                                                           className="mt-1 block w-full disabled:bg-gray-400 text-white"
                                                           readOnly={true} disabled={true}/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <Accordion open={open2 === 2} icon={<Icon id={2} open={open2}/>}>
                                    <AccordionHeader
                                        onClick={() => handleOpen2(2)}>{__("Inventory information")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_local_name">{__("Barcode")}</InputLabel>
                                                <TextInput readOnly={true} disabled={true}
                                                           id="inventoryItems_local_name"
                                                           type="text" name="local_name"
                                                           value={inventoryItem.data.local_name}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_type">{__("Type")}</InputLabel>
                                                <TextInput readOnly={true} disabled={true} id="inventoryItems_type"
                                                           type="text" name="type"
                                                           value={inventoryItem.data.inventory_type.name}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name" value="Pavadinimas"/>
                                                <TextInput id="inventoryItems_name" type="text" name="name"
                                                           value={inventoryItem.data.name}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"
                                                           readOnly={true} disabled={true}/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name_eng" value="Pavadinimas ENG"/>
                                                <TextInput id="inventoryItems_name_eng" type="text" name="name_eng"
                                                           value={inventoryItem.data.name_eng}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"
                                                           readOnly={true} disabled={true}/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <div className="mt-4">
                                    <Link href={route('inventoryItems.index')}
                                          className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                                    >
                                        {__("Inventory")}
                                    </Link>
                                    <Link href={route('reader')}
                                          className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                                    >
                                        {__("Return to scanner")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-auto">
                            <div className="p-6">
                                <table
                                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2">{__("Laboratory")}</th>
                                        <th className="px-3 py-2">{__("Action")}</th>
                                        <th className="px-3 py-2">{__("Amount")}</th>
                                        <th className="px-3 py-2">{__("Comment")}</th>
                                        <th className="px-3 py-2">{__("Created by")}</th>
                                        <th className="px-3 py-2">{__("Created at")}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {logsForItem.data.map(logForItem => (
                                        <tr className={logForItem.action_taken === "RETURN" ? "bg-emerald-600 text-white text-xl border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-emerald-700" : "bg-red-300 text-white text-xl border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-red-400"}>
                                            <td className="px-3 py-2">
                                                <Link href={route("laboratories.show", logForItem.laboratory.id)} className="font-medium text-white hover:underline mx-1"> {logForItem.laboratory.name} </Link>
                                            </td>
                                            <td className="px-3 py-2">{__(logForItem.action_taken)}</td>
                                            <td className="px-3 py-2">{logForItem.amount_handled}</td>
                                            <td className="px-3 py-2">{logForItem.comment}</td>
                                            <td className="px-3 py-2">
                                                <Link href={route("users.show", logForItem.created_by.id)} className="font-medium text-white hover:underline mx-1"> {logForItem.created_by.email} </Link>
                                            </td>
                                            <td className="px-3 py-2">{logForItem.created_at}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
