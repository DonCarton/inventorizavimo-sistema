import { useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid/index.js";
import MegaMenuNavLink from "@/Components/MegaMenuNavLink.jsx";

/**
 * Top-bar menu with sub-links. Opens on mouse hover, and on tap/Enter for touch and
 * keyboard users; closes on Escape, on a click outside and when the mouse leaves.
 * The links are rendered next to the toggle button (not inside it), so they are
 * real, focusable links.
 */
export default function NavDropdown({ label, active = false, children }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const lastPointerType = useRef("");
    const menuId = useId();

    useEffect(() => {
        if (!open) return;
        const closeOnOutsideClick = (e) => {
            if (!wrapperRef.current?.contains(e.target)) setOpen(false);
        };
        const closeOnEscape = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [open]);

    const onToggleClick = () => {
        // A mouse already opened the menu on hover, so a click shouldn't close it again.
        if (lastPointerType.current === "mouse") {
            setOpen(true);
        } else {
            setOpen((current) => !current);
        }
        lastPointerType.current = "";
    };

    return (
        <div
            ref={wrapperRef}
            className="relative flex"
            onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
        >
            <button
                type="button"
                aria-haspopup="true"
                aria-expanded={open}
                aria-controls={menuId}
                onPointerDown={(e) => { lastPointerType.current = e.pointerType; }}
                onClick={onToggleClick}
                className={`inline-flex items-center whitespace-nowrap 2xl:text-lg xl:text-base text-white px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none hover:border-b-indigo-400 dark:text-gray-400 hover:text-teal-100 dark:hover:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ${active ? "border-b-indigo-400 bg-pink-700" : "border-transparent"}`}
            >
                {label}
                <ChevronDownIcon className={`ml-1 w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {open && (
                <div id={menuId}
                     className="absolute left-0 top-full z-20 min-w-max rounded-b-lg border border-gray-100 bg-white text-sm shadow-md dark:border-gray-700 dark:bg-gray-700">
                    <ul className="p-4 space-y-3 text-gray-900 dark:text-white">
                        {children}
                    </ul>
                </div>
            )}
        </div>
    );
}

NavDropdown.Item = function NavDropdownItem({ href, active = false, children }) {
    return (
        <li>
            <MegaMenuNavLink className="2xl:text-lg xl:text-base whitespace-nowrap" href={href} active={active}>
                {children}
            </MegaMenuNavLink>
        </li>
    );
};

NavDropdown.Heading = function NavDropdownHeading({ children }) {
    return (
        <li className="pt-2 first:pt-0 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-400" role="presentation">
            {children}
        </li>
    );
};
