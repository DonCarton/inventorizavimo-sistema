import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { useTranslation } from "@/Libs/useTranslation.jsx";
import ApplicationLogoWhite from "@/Components/ApplicationLogoWhite.jsx";
import MegaMenuNavLink from "@/Components/MegaMenuNavLink.jsx";
import {ChevronDownIcon} from "@heroicons/react/24/solid/index.js";

export default function Authenticated({ user, header, children, can }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showMegaMenuDropdown, setShowMegaMenuDropdown] = useState(false);
    const [showLabMegaMenuDropdown, setShowLabMegaMenuDropdown] = useState(false);
    const { translate } = useTranslation();
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-pink-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogoWhite className="block h-12 w-auto fill-current text-white action:bg-pink-700 hover:bg-pink-700 hover:rounded" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 lg:-my-px lg:ms-10 lg:flex">
                                <NavLink className="2xl:text-lg xl:text-base text-white" href={route('dashboard')} active={route().current('dashboard')}>
                                    {translate("Dashboard")}
                                </NavLink>
                                {can.view.user &&
                                    <NavLink className="2xl:text-lg xl:text-base text-white" href={route('users.index')} active={route().current('users*')}>
                                    {translate("Users")}</NavLink>
                                }
                                <button type="button" onClick={() => setShowMegaMenuDropdown(!showMegaMenuDropdown)} onMouseEnter={() => setShowMegaMenuDropdown(true)} onMouseLeave={() => setShowMegaMenuDropdown(false)}
                                        className={`inline-flex items-center 2xl:text-lg xl:text-base text-white px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none hover:border-b-2 hover:border-b-indigo-400 border-transparent dark:text-gray-400 hover:text-teal-100 dark:hover:text-gray-300 hover:border-indigo-500 dark:hover:border-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ${route().current('inventoryItems*') ? 'border-b-indigo-400 bg-pink-700' : ''}`}>
                                    {translate("Inventory")}
                                    <ChevronDownIcon className="ml-1 w-5 h-5"/>
                                    {showMegaMenuDropdown &&
                                        <div className="absolute z-10 grid w-auto mt-40 text-sm bg-white border border-gray-100 rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-700">
                                            <div className="p-4 pb-0 text-gray-900 md:pb-4 dark:text-white">
                                                <ul className="space-y-4" aria-labelledby="mega-menu-dropdown-button">
                                                    <li>
                                                        <MegaMenuNavLink className="2xl:text-lg xl:text-base" href={route('inventoryItems.index')} active={route().current('inventoryItems.index') && !route().current('inventoryItems.myLaboratory')}>
                                                            {translate("Inventory")}
                                                        </MegaMenuNavLink>
                                                    </li>
                                                    <li>
                                                        <MegaMenuNavLink className="2xl:text-lg xl:text-base" href={route('inventoryItems.myLaboratory')} active={route().current('inventoryItems.myLaboratory')}>
                                                            {translate("My inventory")}
                                                        </MegaMenuNavLink>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>}
                                </button>
                                {can.view.itemType &&
                                    <NavLink className="2xl:text-lg xl:text-base text-white"
                                             href={route('itemTypes.index')} active={route().current('itemTypes*')}>
                                        {translate("Types")}
                                    </NavLink>}
                                {can.view.laboratory &&
                                <button type="button" onClick={() => setShowMegaMenuDropdown(!showLabMegaMenuDropdown)} onMouseEnter={() => setShowLabMegaMenuDropdown(true)} onMouseLeave={() => setShowLabMegaMenuDropdown(false)}
                                        className={`inline-flex items-center 2xl:text-lg xl:text-base text-white px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none hover:border-b-2 hover:border-b-indigo-400 border-transparent dark:text-gray-400 hover:text-teal-100 dark:hover:text-gray-300 hover:border-indigo-500 dark:hover:border-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ${route().current('laboratories*') ? 'border-b-indigo-400 bg-pink-700' : ''}`}>
                                    {translate("Laboratory")}
                                    <ChevronDownIcon className="ml-1 w-5 h-5"/>
                                    {showLabMegaMenuDropdown &&
                                        <div className="absolute z-10 grid w-auto mt-40 text-sm bg-white border border-gray-100 rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-700">
                                            <div className="p-4 pb-0 text-gray-900 md:pb-4 dark:text-white">
                                                <ul className="space-y-4" aria-labelledby="mega-menu-dropdown-button">
                                                    <li>
                                                        <MegaMenuNavLink className="2xl:text-lg xl:text-base" href={route('laboratories.index')} active={route().current('laboratories.index') && !route().current('facilities.index')}>
                                                            {translate("Laboratory")}
                                                        </MegaMenuNavLink>
                                                    </li>
                                                    <li>
                                                        <MegaMenuNavLink className="2xl:text-lg xl:text-base" href={route('facilities.index')} active={route().current('facilities.index')}>
                                                            {translate("Facility")}
                                                        </MegaMenuNavLink>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>}
                                </button>}
                                <NavLink className="2xl:text-lg xl:text-base text-white"
                                         href={route('reader')} active={route().current('reader')}>
                                    {translate("Reader")}
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden lg:flex lg:items-center lg:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent 4xl:text-lg 2xl:text-base xl:text-sm text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route("import-definitions.index")}>{translate("Import definitions")}</Dropdown.Link>
                                        <Dropdown.Link href={route("import-runs.index")}>{translate("Import runs")}</Dropdown.Link>
                                        <Dropdown.Link href={route('profile.edit')}>{translate("Profile")}</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            {translate("Log out")}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center lg:hidden">
                        <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-pink-700 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="white" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' lg:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink className="text-white" href={route('dashboard')} active={route().current('dashboard')}>
                            {translate("Dashboard")}
                        </ResponsiveNavLink>
                        {can.view.user && <ResponsiveNavLink className="text-white" href={route('users.index')} active={route().current('users.index')}>
                            {translate("Users")}
                        </ResponsiveNavLink>}
                        <ResponsiveNavLink className="text-white" href={route('inventoryItems.index')} active={route().current('inventoryItems.index')}>
                            {translate("Inventory")}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink className="text-white" href={route('inventoryItems.myLaboratory')} active={route().current('inventoryItems.myLaboratory')}>
                            {translate("My inventory")}
                        </ResponsiveNavLink>
                        {can.view.itemType && <ResponsiveNavLink className="text-white" href={route('itemTypes.index')} active={route().current('itemTypes.index')}>
                            {translate("Types")}
                        </ResponsiveNavLink>}
                        {can.view.laboratory && <ResponsiveNavLink className="text-white" href={route('laboratories.index')} active={route().current('laboratories.index')}>
                            {translate("Laboratories")}
                        </ResponsiveNavLink>}
                        <ResponsiveNavLink className="text-white" href={route('reader')} active={route().current('reader')}>
                            {translate("Reader")}
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-white dark:text-gray-200">{user.name}</div>
                            <div className="font-medium text-sm text-gray-50">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            {/*TODO FOR SOME REASON, THE TRANSLATIONS HERE ARE CAUSING ISSUES*/}
                            <ResponsiveNavLink className="text-white" href={route("import-definitions.index")}>{translate("Import definitions")}</ResponsiveNavLink>
                            <ResponsiveNavLink className="text-white" href={route("import-runs.index")}>{translate("Import runs")}</ResponsiveNavLink>
                            <ResponsiveNavLink className="text-white" href={route('profile.edit')}>{translate("Profile")}</ResponsiveNavLink>
                            <ResponsiveNavLink className="text-white" method="post" href={route('logout')} as="button">
                                {translate("Log out")}
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
