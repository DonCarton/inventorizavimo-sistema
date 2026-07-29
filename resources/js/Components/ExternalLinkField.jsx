import { FiExternalLink } from "react-icons/fi";

export default function ExternalLinkField({ id, value, className = "" }) {
    const href = /^https?:\/\//i.test(value) ? value : `https://${value}`;

    return (
        <a
            id={id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={value}
            className={
                "flex items-center justify-between gap-2 border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-400 dark:bg-gray-700 text-white px-3 py-2 truncate hover:bg-gray-500 dark:hover:bg-gray-600 hover:underline transition ease-in-out duration-150 " +
                className
            }
        >
            <span className="truncate">{value}</span>
            <FiExternalLink className="shrink-0" />
        </a>
    );
}
