
import {RiFileExcel2Fill} from "react-icons/ri";

export default function GroupButtons ({
    firstButtonText = 'First',
    firstUrl = '#',
    secondButtonText = 'Second',
    promptImportModal,
    thirdButtonText = 'Third',
    thirdUrl = '#'
}){
    return(
        <div className="grid grid-cols-3 justify-items-center">
            <a className="px-2 py-2 sm:text-sm/[12px] bg-white dark:bg-gray-800 border-l-2 border-t-2 border-b-2 rounded-l-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center 4xl:text-xl xl:text-xl text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150"
               href={firstUrl}>
                {firstButtonText}
            </a>
            <a onClick={promptImportModal}
               className="px-2 py-2 sm:text-sm/[12px] bg-white dark:bg-gray-800 border-gray-300 border-2 dark:border-gray-500 dark:border-2 w-full font-semibold text-center 4xl:text-lg xl:text-sm text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150">
                {secondButtonText}
            </a>
            <a className="flex items-center justify-center px-2 sm:text-sm/[12px] bg-white dark:bg-gray-800 border-r-2 border-t-2 border-b-2 rounded-r-lg border-gray-300 dark:border-gray-500 w-full font-semibold text-center 4xl:text-lg xl:text-sm text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-25 transition ease-in-out duration-150"
               href={thirdUrl} target="_blank">
                {thirdButtonText}
                <RiFileExcel2Fill className="w-6 h-6 ml-2"/>
            </a>
        </div>
    )
}
