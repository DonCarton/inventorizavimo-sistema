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
        <div className="flex items-center">
            <Switch
                checked={theme === 'dark'}
                onChange={toggleTheme}
                className={`${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-yellow-400'
                } relative inline-flex items-center h-6 w-14 rounded-full transition-colors duration-200 focus:outline-none`}
            >
                <span
                    className={`${
                        theme === 'dark' ? 'translate-x-6 bg-gray-400' : '-translate-x-1 bg-white'
                    } pointer-events-none inline-block w-9 h-9 transform transition-transform duration-200 rounded-full`}
                >
          {theme === 'light' ? (
              <WiDaySunny className="w-9 h-9 text-yellow-700"/>
          ) : (
              <WiNightClear className="w-9 h-9 text-black"/>
          )}
            </span>
            </Switch>
        </div>
    );
};

export default ThemeToggle;
