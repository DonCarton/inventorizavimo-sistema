import React, { useState, useEffect } from 'react';
import { HiOutlineEye } from 'react-icons/hi';

const ShowEditOrIcon = ({textValue}) => {
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
                <HiOutlineEye className="w-6 h-6 text-gray-400 hover:text-gray-700 hover:bg-gray-200 hover:rounded" />
            ) : (
                <span>{textValue}</span>
            )}
        </div>
    );
};

export default ShowEditOrIcon;
