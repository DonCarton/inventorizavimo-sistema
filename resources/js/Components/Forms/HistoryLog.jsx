import { useState } from "react";
import Modal from "@/Components/Modal.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import StringHelper from "@/Libs/StringHelper";
import { useEffect } from "react";
import PerPageSelect from "../PerPageSelector";
import HistoryTable from "@/Components/Tables/HistoryTable.jsx";

export default function HistoryLog({
    objectId,
    objectType,
    nameOfButton,
    nameOfCloseButton,
}) {
    const [logs, setLogs] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [fetchTrigger, setFetchTrigger] = useState(false);
    const [linksFromCall, setLinksFromCall] = useState(null);
    const [showPerPageSelect, setShowPerPageSelect] = useState(false);

    const getFetchData = async (value, type, page = 1) => {
        if (value !== "") {
            try {
                const getResponse = await axios.get("/getObjectHistory", {
                    params: {
                        object_id: value,
                        object_type: type,
                        page: page,
                        per_page: perPage,
                    }
                });
                setShowModal(true);
                setLogs(getResponse.data.data);
                setLinksFromCall(getResponse.data.meta.links);
                setShowPerPageSelect(getResponse.data.meta.last_page > 1);
            }
            catch (error) {
                console.log("Error getting logs:",error);
            }
        }
    };
    const handlePerPageChange = (event) => {
        setPerPage(Number(event.target.value));
        setFetchTrigger(true);
    };
    const handleGetData = () => {
        setFetchTrigger(true);
        getFetchData(objectId, objectType, 1);
    };
    const handleLinkChange = (url) => {
        const params = new URL(url).searchParams;
        const page = params.get('page');
        getFetchData(objectId, objectType, page);
    }
    useEffect(() => {
        if (fetchTrigger) {
            getFetchData(objectId, objectType, 1);
            setFetchTrigger(false);
        }
    }, [perPage, fetchTrigger]);
    return (
        <div>
            <button onClick={handleGetData}>{nameOfButton}</button>
            <div>
                <Modal show={showModal} closeable maxWidth="7xl" className="w-full">
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {StringHelper.__("Current object history")}
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {StringHelper.__("History description")}
                        </p>
                        <div className="mt-6 w-full h-96 overflow-auto">
                            <HistoryTable data={logs} />
                        </div>
                        <div className="mt-6 flex justify-between">
                            <SecondaryButton
                                onClick={() => setShowModal(false)}
                            >
                                {nameOfCloseButton}
                            </SecondaryButton>
                            <PaginationWithLinks className="mt-2" links={linksFromCall} onLinkChange={handleLinkChange} />
                            {showPerPageSelect &&
                            <PerPageSelect
                                value={perPage}
                                onChange={handlePerPageChange}
                                className="ml-2"
                            />}
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

const PaginationWithLinks = ({ links, onLinkChange, className = '' }) => {
    return (
        <nav className={"text-center " + className}>
            {links.map(link => (
                <button
                    onClick={() => onLinkChange(link.url || "")}
                    key={link.label}
                    className={
                        "inline-block py-2 px-3 rounded-lg text-gray-950 text-xs " +
                        (link.active ? "bg-gray-500 " : " ") +
                        (!link.url ? "!text-gray-500 cursor-not-allowed " : "hover:bg-gray-400")
                    }
                    disabled={!link.url || link.active}
                    dangerouslySetInnerHTML={{ __html: link.label }}>
                    </button>
            ))}
        </nav>
    )
}
