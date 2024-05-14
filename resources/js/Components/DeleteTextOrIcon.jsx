import React, { useState, useEffect } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';

const DeleteTextOrIcon = ({textValue}) => {
    const [isSmall, setIsSmall] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmall(window.innerWidth <= 640); // Adjust the breakpoint as needed
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <div>
            {isSmall ? (
                <HiOutlineTrash className="w-6 h-6 text-red-500 hover:text-red-700 hover:bg-gray-200 hover:rounded" />
            ) : (
                <span>{textValue}</span>
            )}
        </div>
    );
};

export default DeleteTextOrIcon;
