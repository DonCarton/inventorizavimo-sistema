import { useState } from "react";
import Modal from "@/Components/Modal.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import StringHelper from "@/Libs/StringHelper";
import PlaygroundV2 from "@/Pages/PlaygroundV2.jsx";
import { useEffect } from "react";
import PerPageSelect from "../PerPageSelector";

export default function HistoryLog({
    objectId,
    objectType,
    nameOfButton,
    nameOfCloseButton,
}) {
    const [logs, setLogs] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [fetchTrigger, setFetchTrigger] = useState(false);
    const [linksFromCall, setLinksFromCall] = useState(null);
    const [showPerPageSelect, setShowPerPageSelect] = useState(false);

    const fetchData = async (value, type, page = 1) => {
        if (value !== "") {
            try {
                // const response = await axios.post("/queryObjectHistory", {
                const response = await axios.post("/queryObjectHistoryTest", {
                    object_id: value,
                    object_type: type,
                    page: page,
                    per_page: perPage,
                });
                setShowModal(true);
                setLogs(response.data.data);
                setCurrentPage(response.data.current_page);
                setTotalPages(response.data.last_page);
                setLinksFromCall(response.data.links);
                setShowPerPageSelect(response.data.last_page > 1);
            } catch (error) {
                alert("Error fetching logs: " + error);
                console.error("Error fetching logs:", error);
            }
        }
    };
    const handlePageChange = (page) => {
        fetchData(objectId, objectType, page);
    };
    const handlePerPageChange = (event) => {
        setPerPage(Number(event.target.value));
        setFetchTrigger(true);
    };
    const handleFetchData = () => {
        setFetchTrigger(true);
        fetchData(objectId, objectType, 1);
    };
    const handleLinkChange = (url) => {
        const params = new URL(url).searchParams;
        const page = params.get('page');
        fetchData(objectId, objectType, page);
    }
    useEffect(() => {
        if (fetchTrigger) {
            fetchData(objectId, objectType, 1);
            setFetchTrigger(false);
        }
    }, [perPage, fetchTrigger]);
    return (
        <div>
            <button onClick={handleFetchData}>{nameOfButton}</button>
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
                            <PlaygroundV2 data={logs} />
                        </div>
                        {/* <div className="mt-6 flex justify-start"> */}
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

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
}) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }
    return (
        <div className={"text-center mt-1 " + className}>
            {pages.map((page) => (
                <button
                    className={
                        "ml-1 inline py-2 px-3 rounded-lg text-gray-950 text-xs bg-gray-400 disabled:!text-white disabled:cursor-not-allowed hover:bg-gray-400"
                    }
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={page === currentPage ? true : false}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

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
