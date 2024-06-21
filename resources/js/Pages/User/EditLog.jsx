import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm} from "@inertiajs/react";
import InputLabel from "@/Components/Forms/InputLabel.jsx";
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
import {TbArrowsUpDown} from "react-icons/tb";
import TextInputExtra from "@/Components/Forms/TextInputExtra.jsx";
import NumericInput from "@/Components/Forms/NumericInput.jsx";
import {FaQrcode} from "react-icons/fa";
import {MdClose} from "react-icons/md";

export default function Edit({auth, inventoryItem, role, logsForItem, totalInUse, laboratories, previousUrl, redirectToReader}) {
    const [previousUrlPage] = useState(previousUrl);
    const [actionFromUser, setActionFromUser] = useState('REMOVE');
    const {data, setData, patch, errors} = useForm({
        total_amount: inventoryItem.total_amount,
        laboratory_id: '',
        action: actionFromUser,
        amount: '',
        comment: '',
        total_available: totalInUse,
        urlToRedirect: redirectToReader,
    })
    const [modalOpen, setModalOpen] = useState(false);
    const [open, setOpen] = useState(1);
    const [open2, setOpen2] = useState(0);
    const [labInfo, setLabInfo] = useState([]);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    const handleOpen2 = (value) => setOpen2(open2 === value ? 0 : value);
    const onSubmit2 = (e) => {
        e.preventDefault();
        patch(route('inventoryItems.takeOutAmountLog', inventoryItem.id));
    }
    const closeModal = (e) =>{
        setModalOpen(false);
    }
    const openModal = (e) =>{
        setModalOpen(true);
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
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Change amount")} - {inventoryItem.local_name} - {inventoryItem.name}</h2>
                </div>
            }
            role={role}
        >
            <Head title={__("Change amount") + ' - ' + inventoryItem.local_name}/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg space-y-6">

                        <Modal closeable="sm" show={modalOpen} onClose={closeModal}>
                            <div className="flex justify-between items-center p-4 bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700">
                                <h4 className="text-lg font-medium">
                                    {inventoryItem.laboratory === null ? __("Base location undefined") : __("Base amount is located") + ' ' + inventoryItem.laboratory.name }
                                </h4>
                                <button onClick={closeModal}
                                        className="text-gray-600 hover:text-gray-800 dark:hover:text-white">
                                    <MdClose size={24}/>
                                </button>
                            </div>
                            <form className="p-6" onSubmit={onSubmit2}>
                                <div className="grid grid-cols-2 gap-x-6">
                                    <div className="mt-4">
                                        <InputLabel htmlFor="inventoryItems_laboratory_id">{__("Laboratory")}<span
                                            className="text-red-500">*</span></InputLabel>
                                        <select
                                            className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                                            value={data.laboratory_id}
                                            onChange={e => setData('laboratory_id', e.target.value)}>
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
                                        <select
                                            className={data.action === 'REMOVE' ? "border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full bg-red-300" : "border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full bg-emerald-300 option:"}
                                            onChange={e => setData('action', e.target.value)} value={data.action}>
                                            {actionsOnInventory.map(action => (
                                                <option value={action.value}
                                                        className={action.className}>{__(action.label)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mt-4">
                                        <InputLabel htmlFor="inventoryItems_amount">{__("Amount")}<span
                                            className="text-red-500">*</span></InputLabel>
                                        <NumericInput type="text" className="mt-1 block w-full"
                                                      id="inventoryItems_amount" name="amount"
                                                      onChange={e => setData('amount', e.target.value)}></NumericInput>
                                        <InputError message={errors.amount} className="mt-2"/>
                                    </div>
                                    <div className="mt-4">
                                        <InputLabel htmlFor="inventoryItems_comment">{__("Comment")}<span
                                            className="text-red-500">*</span></InputLabel>
                                        <TextInputExtra type="textarea" className="mt-1 block w-full"
                                                        id="inventoryItems_comment" name="comment"
                                                        onChange={e => setData('comment', e.target.value)}/>
                                        <InputError message={errors.comment} className="mt-2"/>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <SecondaryButton className="hover:bg-gray-100 mr-2"
                                                     onClick={closeModal}>{__("Cancel")}</SecondaryButton>
                                    <PrimaryButton className="bg-emerald-700">{__("Save")}</PrimaryButton>
                                </div>
                            </form>
                        </Modal>
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="flex justify-end">
                                <a className="hover:cursor-pointer" type="button" onClick={openModal}>
                                    <div
                                        className="flex items-center w-40 space-x-2 bg-amber-300 rounded border shadow p-2 hover:bg-amber-400">
                                        <TbArrowsUpDown/>
                                        <span className="text-gray-700">{__("Perform change")}</span>
                                    </div>
                                </a>
                            </div>
                            <div className="pr-6 pl-6 pb-6">
                                <Accordion open={open === 1} icon={<Icon id={1} open={open}/>}>
                                    <AccordionHeader onClick={() => handleOpen(1)}>{__("Amount")}</AccordionHeader>
                                    <AccordionBody>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div className="mt-4 w-full flex flex-col">
                                                <InputLabel htmlFor="inventoryItems_total_amount" value={__("Count")}/>
                                                <TextInput id="inventoryItems_total_amount" type="text"
                                                           name="total_amount" value={data.total_amount}
                                                           className="mt-1 block w-full disabled:bg-gray-400 text-white"
                                                           readOnly={true} disabled={true}/>
                                            </div>
                                            <div className="mt-4 w-full flex flex-col">
                                                <InputLabel htmlFor="inventoryItems_total_available"
                                                            value={__("Available amount")}/>
                                                <TextInput id="inventoryItems_total_available" type="text"
                                                           name="total_available"
                                                           value={totalInUse}
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
                                                           value={inventoryItem.local_name}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel
                                                    htmlFor="inventoryItems_type">{__("Type")}</InputLabel>
                                                <TextInput readOnly={true} disabled={true} id="inventoryItems_type"
                                                           type="text" name="type"
                                                           value={inventoryItem.inventory_type.name}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name" value="Pavadinimas"/>
                                                <TextInput id="inventoryItems_name" type="text" name="name"
                                                           value={inventoryItem.name}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"
                                                           readOnly={true} disabled={true}/>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="inventoryItems_name_eng" value="Pavadinimas ENG"/>
                                                <TextInput id="inventoryItems_name_eng" type="text" name="name_eng"
                                                           value={inventoryItem.name_eng}
                                                           className="mt-1 block w-full disabled:bg-gray-400 disabled:text-white"
                                                           readOnly={true} disabled={true}/>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </Accordion>
                                <div className="mt-4 flex items-center">
                                    <Link
                                        href={previousUrlPage}
                                        className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150 mr-2"
                                    >
                                        {__("Previous page")}
                                    </Link>
                                    <Link
                                        href={route('reader')}
                                        className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        <FaQrcode className="mr-2"/>
                                        {__("Scanner")}
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
                                                <Link href={route("laboratories.show", logForItem.laboratory.id)}
                                                      className="font-medium text-white hover:underline mx-1"> {logForItem.laboratory.name} </Link>
                                            </td>
                                            <td className="px-3 py-2">{__(logForItem.action_taken)}</td>
                                            <td className="px-3 py-2">{logForItem.amount_handled}</td>
                                            <td className="px-3 py-2">{logForItem.comment}</td>
                                            <td className="px-3 py-2">
                                                <Link href={route("users.show", logForItem.created_by.id)}
                                                      className="font-medium text-white hover:underline mx-1"> {logForItem.created_by.email} </Link>
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
