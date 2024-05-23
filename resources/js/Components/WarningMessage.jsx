import React, { useEffect, useState } from 'react';
import { TbInfoCircle } from 'react-icons/tb';

const WarningMessage = ({ message }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000); // 5000ms = 5 seconds

        return () => clearTimeout(timer);
    }, [message]);

    return (
        visible && (
            <div className="flex items-center bg-amber-600 py-2 px-4 text-white font-bold rounded mb-4 animate-fadeOut">
                <TbInfoCircle className="mr-2" size={24} />
                <span>{message}</span>
            </div>
        )
    );
};

export default WarningMessage;
