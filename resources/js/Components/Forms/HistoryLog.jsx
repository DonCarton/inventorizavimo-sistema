import {useState} from "react";
import Modal from "@/Components/Modal.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import {__} from "@/Libs/Lang.jsx";

export default function HistoryLog({objectId, objectType, nameOfButton, nameOfCloseButton, children}) {
    const [showModal, setShowModal] = useState(false);
    const [logs, setLogs] = useState([]);
    const fetchLogs = async (value, type) => {
        if (value !== '') {
            try {
                const response = await axios.post('/queryObjectHistory', {
                    object_id: value,
                    object_type: type,
                });
                setShowModal(true);
                setLogs(response.data);
            } catch (error) {
                alert('Error fetching logs: ' + error);
                console.error('Error fetching logs:', error);
            }
        }
    };
    const [showContent, setShowContent] = useState(false);
    return (
        <div>
            <button onClick={() => fetchLogs(objectId, objectType)}>{nameOfButton}</button>
            <div>
                <Modal show={showModal} closeable>
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {__("Current object history")}
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {__("History description")}
                        </p>

                        <div className="mt-6">
                            <table>
                                <thead>
                                <tr>
                                    <th className="text-left">{__("Field")}</th>
                                    <th className="text-right">{__("Old")}</th>
                                    <th className="text-right">{__("New")}</th>
                                    <th className="text-right">{__("Who")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className="pl-2 text-right">Dominykas</td>
                                </tr>
                                </tbody>
                            </table>
                            {logs.length > 0 &&
                                <div>
                                    {logs.map(
                                        (log, index) => (
                                            <div>
                                                <button onClick={() => setShowContent(!showContent)} className="px-2 border-2 border-gray-400 focus:ring-indigo-500">Press it</button>
                                                <ul key={index} className={showContent ? "w-32" : "hidden"}>
                                                    {
                                                        Object.entries(log).map(
                                                            ([key, value], index) => (
                                                                <li key={key}>{value}</li>
                                                            )
                                                        )
                                                    }
                                                </ul>
                                            </div>)
                                    )}
                                </div>}
                        </div>
                        <div className="mt-6 flex justify-start">
                            <SecondaryButton onClick={() => setShowModal(false)}>{nameOfCloseButton}</SecondaryButton>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
