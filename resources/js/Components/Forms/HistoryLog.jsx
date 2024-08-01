import { useState } from "react";
import Modal from "@/Components/Modal.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import { __ } from "@/Libs/Lang.jsx";
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
    const [perPage, setPerPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [fetchTrigger, setFetchTrigger] = useState(false);

    const fetchData = async (value, type, page = 1) => {
        if (value !== "") {
            try {
                const response = await axios.post("/queryObjectHistory", {
                    object_id: value,
                    object_type: type,
                    page: page,
                    per_page: perPage,
                });
                setShowModal(true);
                setLogs(response.data.data);
                setCurrentPage(response.data.current_page);
                setTotalPages(response.data.last_page);
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
                            {__("Current object history")}
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {__("History description")}
                        </p>
                        <div className="mt-6 w-full h-96 overflow-auto">
                            <PlaygroundV2 data={logs} />
                        </div>
                        <div className="mt-6 flex flex-row justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                            <PerPageSelect
                                value={perPage}
                                onChange={handlePerPageChange}
                                className="ml-2"
                            />
                        </div>
                        <div className="mt-6 flex justify-start">
                            <SecondaryButton
                                onClick={() => setShowModal(false)}
                            >
                                {nameOfCloseButton}
                            </SecondaryButton>
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
