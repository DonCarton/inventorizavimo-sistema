import React, { useState, useEffect } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';

const EditTextOrIcon = ({textValue}) => {
    const [isSmall, setIsSmall] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmall(window.innerWidth <= 640); // Adjust the breakpoint as needed
        };

        // Call handleResize initially
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            {isSmall ? (
                <HiOutlinePencil className="w-6 h-6 text-amber-400 hover:text-amber-700 hover:bg-gray-200 hover:rounded" />
            ) : (
                <span>{textValue}</span>
            )}
        </div>
    );
};

export default EditTextOrIcon;
