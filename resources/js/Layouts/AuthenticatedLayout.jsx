import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import NavDropdown from '@/Components/NavDropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { useTranslation } from "@/Libs/useTranslation.jsx";
import ApplicationLogoWhite from "@/Components/ApplicationLogoWhite.jsx";

export default function Authenticated({ user, header, children, can }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { translate } = useTranslation();
    const isCurrent = (...patterns) => patterns.some((pattern) => route().current(pattern));

    // Admin pages, grouped as in the "Administravimas" menu; each link only if permitted.
    const adminSections = [
        {
            heading: translate("Users and laboratories"),
            links: [
                can.view.user && { href: route('users.index'), active: isCurrent('users*'), label: translate("Users") },
                can.view.laboratory && { href: route('laboratories.index'), active: isCurrent('laboratories*'), label: translate("Laboratories") },
                can.view.facility && { href: route('facilities.index'), active: isCurrent('facilities*'), label: translate("Facilities") },
            ].filter(Boolean),
        },
        {
            heading: translate("Inventory settings"),
            links: [
                can.view.itemType && { href: route('itemTypes.index'), active: isCurrent('itemTypes*'), label: translate("Types") },
                can.view.measurementUnit && { href: route('measurementUnits.index'), active: isCurrent('measurementUnits*'), label: translate("Units") },
            ].filter(Boolean),
        },
        {
            heading: translate("Imports"),
            links: [
                can.view.importDefinition && { href: route('import-definitions.index'), active: isCurrent('import-definitions*'), label: translate("Import definitions") },
                can.view.importRun && { href: route('import-runs.index'), active: isCurrent('import-runs*'), label: translate("Import runs") },
            ].filter(Boolean),
        },
    ].filter((section) => section.links.length > 0);
    const adminActive = adminSections.some((section) => section.links.some((link) => link.active));

    const inventoryLinks = [
        { href: route('inventoryItems.index'), active: isCurrent('inventoryItems.*') && !isCurrent('inventoryItems.myLaboratory'), label: translate("Inventory") },
        { href: route('inventoryItems.myLaboratory'), active: isCurrent('inventoryItems.myLaboratory'), label: translate("My inventory") },
    ];

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

                            <div className="hidden space-x-6 xl:space-x-8 lg:-my-px lg:ms-10 lg:flex">
                                <NavLink className="2xl:text-lg xl:text-base text-white whitespace-nowrap" href={route('dashboard')} active={isCurrent('dashboard')}>
                                    {translate("Dashboard")}
                                </NavLink>
                                <NavDropdown label={translate("Inventory")} active={isCurrent('inventoryItems*')}>
                                    {inventoryLinks.map((link) => (
                                        <NavDropdown.Item key={link.href} href={link.href} active={link.active}>{link.label}</NavDropdown.Item>
                                    ))}
                                </NavDropdown>
                                <NavLink className="2xl:text-lg xl:text-base text-white whitespace-nowrap" href={route('reader')} active={isCurrent('reader')}>
                                    {translate("Reader")}
                                </NavLink>
                                {adminSections.length > 0 &&
                                    <NavDropdown label={translate("Administration")} active={adminActive}>
                                        {adminSections.map((section) => [
                                            <NavDropdown.Heading key={section.heading}>{section.heading}</NavDropdown.Heading>,
                                            ...section.links.map((link) => (
                                                <NavDropdown.Item key={link.href} href={link.href} active={link.active}>{link.label}</NavDropdown.Item>
                                            )),
                                        ])}
                                    </NavDropdown>}
                            </div>
                        </div>

                        <div className="hidden lg:flex lg:items-center lg:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center whitespace-nowrap px-3 py-2 border border-transparent 4xl:text-lg 2xl:text-base xl:text-sm text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                                title={`${user.first_name} ${user.last_name}`}
                                            >
                                                <span className="max-w-[14rem] truncate">{`${user.first_name} ${user.last_name}`}</span>

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
                                        {can.view.systemConfiguration &&
                                            <Dropdown.Link href={route('systemConfigurations.index')}>{translate("System configuration")}</Dropdown.Link>}
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
                        <ResponsiveNavLink className="text-white" href={route('dashboard')} active={isCurrent('dashboard')}>
                            {translate("Dashboard")}
                        </ResponsiveNavLink>
                        {inventoryLinks.map((link) => (
                            <ResponsiveNavLink key={link.href} className="text-white" href={link.href} active={link.active}>{link.label}</ResponsiveNavLink>
                        ))}
                        <ResponsiveNavLink className="text-white" href={route('reader')} active={isCurrent('reader')}>
                            {translate("Reader")}
                        </ResponsiveNavLink>
                        {adminSections.map((section) => (
                            <div key={section.heading} className="pt-2">
                                <div className="ps-4 pb-1 text-xs font-semibold uppercase tracking-wide text-pink-200">{section.heading}</div>
                                {section.links.map((link) => (
                                    <ResponsiveNavLink key={link.href} className="text-white" href={link.href} active={link.active}>{link.label}</ResponsiveNavLink>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-white dark:text-gray-200">{`${user.first_name} ${user.last_name}`}</div>
                            <div className="font-medium text-sm text-gray-50">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            {can.view.systemConfiguration &&
                                <ResponsiveNavLink className="text-white" href={route('systemConfigurations.index')} active={isCurrent('systemConfigurations*')}>{translate("System configuration")}</ResponsiveNavLink>}
                            <ResponsiveNavLink className="text-white" href={route('profile.edit')} active={isCurrent('profile*')}>{translate("Profile")}</ResponsiveNavLink>
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
