import React, { useEffect, useState } from 'react';
import { WiDaySunny, WiNightClear } from "react-icons/wi";
import {Switch} from "@headlessui/react";

const ThemeToggle = ({ showToggle = true }) => {
    const getInitialTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme || 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);
    return (
        <div className="flex items-center mt-2">
            <Switch
                checked={theme === 'dark'}
                onChange={toggleTheme}
                className={`${
                    theme === 'dark' ? 'bg-gray-400 border-2 border-white' : 'bg-pink-800'
                } relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-200 focus:outline-none`}
            >
                <span
                    className={`${
                        theme === 'dark' ? 'translate-x-6 bg-gray-400 border-2 border-white' : '-translate-x-1 bg-white border-2 border-pink-800'
                    } pointer-events-none inline-block w-7 h-7 transform transition-transform duration-200 rounded-full`}
                >
          {theme === 'light' ? (
              <WiDaySunny className="w-6 h-6 text-pink-800"/>
          ) : (
              <WiNightClear className="w-6 h-6 text-white"/>
          )}
            </span>
            </Switch>
        </div>
    );
};

export default ThemeToggle;
