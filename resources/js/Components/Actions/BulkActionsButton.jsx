import StringHelper from "@/Libs/StringHelper";
import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

const PANEL_WIDTH = 160; // matches w-40

const BulkActionsButton = ({ children }) => {
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);
    const panelRef = useRef(null);
    const [showItems, setShowItems] = useState(false);
    const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });

    const updatePanelPosition = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setPanelPosition({ top: rect.bottom + 8, left: rect.right - PANEL_WIDTH });
    };

    const handleClickOutside = (event) => {
        const clickedTrigger = dropdownRef.current && dropdownRef.current.contains(event.target);
        const clickedPanel = panelRef.current && panelRef.current.contains(event.target);
        if (!clickedTrigger && !clickedPanel) {
            setShowItems(false);
        }
    };
    const items = React.Children.toArray(children);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!showItems) return;
        updatePanelPosition();
        // capture:true so this also fires for scrolling inside nested
        // containers (e.g. the table's own horizontal scroll area).
        window.addEventListener('scroll', updatePanelPosition, true);
        window.addEventListener('resize', updatePanelPosition);
        return () => {
            window.removeEventListener('scroll', updatePanelPosition, true);
            window.removeEventListener('resize', updatePanelPosition);
        };
    }, [showItems]);

    if (items.length === 0) return null;

    if (items.length === 1) {
        return (
            <>
                {items[0]}
            </>
        );
    };

    const toggle = () => {
        if (!showItems) updatePanelPosition();
        setShowItems((prev) => !prev);
    };

    return (
        <div
            id="dropdown-interactions"
            name="interactions"
            className="relative"
            ref={dropdownRef}
        >
            <button
                ref={triggerRef}
                type="button"
                className="flex items-center px-4 bg-white font-semibold uppercase text-gray-700 dark:text-gray-300 border-2 border-gray-300 rounded-lg focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={toggle}
            >
                {StringHelper.__("Action")}
                <span className="mx-2 h-4 border-l border-gray-700"></span>
                <svg
                    className={`w-4 h-4 transition-transform transform ${showItems ? "rotate-180" : "rotate-0"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {showItems && createPortal(
                <div
                    ref={panelRef}
                    style={{ position: 'fixed', top: panelPosition.top, left: panelPosition.left, width: PANEL_WIDTH }}
                    className="space-y-1 transition-all duration-300 ease-out transform z-50 opacity-100 translate-y-0"
                >
                    {items.map((item, index) => (
                        <div key={index} className="w-full">{item}</div>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
};

export default BulkActionsButton;
