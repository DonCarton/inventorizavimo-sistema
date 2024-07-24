import {RiFileExcel2Fill} from "react-icons/ri";

export default function DownloadButton({onClick, linkToItem, children}){
    return(
        <a target="_blank" onClick={onClick} href={linkToItem} className="flex items-center justify-center px-4 py-2 sm:text-sm sm:px-2 bg-white dark:bg-gray-800 border-gray-300 border-2 rounded-lg dark:border-gray-500 font-semibold text-center xl:text-sm text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                <RiFileExcel2Fill className="w-6 h-6"/>
            {children}
        </a>
    )
}
