import React, { useEffect, useState } from 'react';
import { TbInfoCircle } from 'react-icons/tb';

const SuccessMessage = ({ uniqueId, message }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (uniqueId) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [uniqueId]);

    return (
        visible && (
            <div
                className="flex items-center bg-emerald-600 py-2 px-4 text-white font-bold rounded mb-4 animate-fadeOut">
                <TbInfoCircle className="mr-2" size={24} />
                <span>{message}</span>
            </div>
        )
    );
};

export default SuccessMessage;
