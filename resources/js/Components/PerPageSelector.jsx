export default function PerPageSelect({value, onChange, className = ''}){
    return (
        <select value={value} onChange={onChange} className={"bg-gray-50 border border-gray-300 hover:bg-pink-50 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " + className}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
        </select>
    );
}
