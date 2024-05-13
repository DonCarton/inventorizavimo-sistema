import { useState } from 'react';
import axios from 'axios';
import Modal from "@/Components/Modal.jsx";

const InventoryItemModal = ({ itemId, buttonValue, ...props }) => {
    const [item, setItem] = useState(null);

    const fetchItemInfo = () => {
        axios.get(`/inventoryItems/${itemId}`)
            .then(response => {
                setItem(response.data);
            })
            .catch(error => {
                console.error('Error fetching item information:', error);
            });
    };

    return (
        <div>
            <button onClick={fetchItemInfo}>{buttonValue}</button>
            {item && (
                <Modal show={true} closeable={true}>
                    <div className="modal">
                        <h2>Inventory Item Details</h2>
                        <p>Name: {item.name}</p>
                        <p>Description: {item.description}</p>
                        <button onClick={() => setItem(null)}>Close</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default InventoryItemModal;
